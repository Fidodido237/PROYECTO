"use client";

import { useState } from "react";
import Turnstile from "react-turnstile";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [mustShowCaptcha, setMustShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mustShowCaptcha && !captchaToken) {
      setError("Por favor, resuelva el codigo Captcha de seguridad.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.showCaptcha) {
          setMustShowCaptcha(true);
          setCaptchaToken("");
          setCaptchaKey((k) => k + 1);
        }
        setError(data.message || "Error al iniciar sesion");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Inicio de sesion correcto");
      setMustShowCaptcha(false);
      setCaptchaToken("");
      setCaptchaKey((k) => k + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">PROYECTO DE LOGIN</h1>
          <p className="mt-2 text-sm text-gray-400">Inicia sesion de forma segura</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">Correo Electronico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Contrasena</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {mustShowCaptcha && (
            <div className="flex justify-center py-2 bg-gray-900/50 rounded border border-gray-700/50">
              <Turnstile
                key={captchaKey}
                sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || ""}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Autenticando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}