import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    await connectDB();

    let ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (ip.includes(",")) ip = ip.split(",")[0].trim();
    if (ip === "::1") ip = "127.0.0.1";

    const body = await request.json();
    const { email, password, captchaToken } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Credenciales incorrectas." },
        { status: 404 }
      );
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutosRestantes = Math.ceil(
        (user.lockUntil.getTime() - new Date().getTime()) / (1000 * 60)
      );
      return NextResponse.json(
        {
          message: `Demasiados intentos fallidos. Tu IP [${ip}] y cuenta han sido bloqueadas. Intenta de nuevo en ${minutosRestantes} minutos.`,
        },
        { status: 429 }
      );
    }

    if (user.loginAttempts >= 3) {
      if (!captchaToken) {
        return NextResponse.json(
          { message: "Seguridad activada: Por favor, resuelva el codigo Captcha para continuar.", showCaptcha: true },
          { status: 403 }
        );
      }

      const cloudflareUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
      const secretKey = process.env.CLOUDFLARE_SECRET_KEY;

      if (!secretKey) {
        throw new Error("CLOUDFLARE_SECRET_KEY no configurada.");
      }

      const formData = new URLSearchParams();
      formData.append("secret", secretKey);
      formData.append("response", captchaToken);
      formData.append("remoteip", ip);

      const verifyResponse = await fetch(cloudflareUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        return NextResponse.json(
          { message: "Verificacion de Captcha invalida o expirada. Intente nuevamente.", showCaptcha: true },
          { status: 403 }
        );
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      let currentAttempts = Number(user.loginAttempts) || 0;
      currentAttempts += 1;

      let updateFields: any = { loginAttempts: currentAttempts };

      if (currentAttempts >= 5) {
        updateFields.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await User.updateOne({ email }, { $set: updateFields });

      return NextResponse.json(
        {
          message: `Contrasena incorrecta. Intentos fallidos: ${currentAttempts}/5.`,
          loginAttempts: currentAttempts,
          showCaptcha: currentAttempts >= 3,
        },
        { status: 401 }
      );
    }

    if (!JWT_SECRET) throw new Error("JWT_SECRET no configurado.");

    await User.updateOne(
      { email },
      {
        $set: { loginAttempts: 0, lastLoginIP: ip },
        $unset: { lockUntil: "" },
      }
    );

    const token = jwt.sign(
      { userId: user._id, email: user.email, userIP: ip },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        message: "Autenticacion exitosa",
        token,
        user: { id: user._id, email: user.email },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error interno del servidor.", error: error.message },
      { status: 500 }
    );
  }
}