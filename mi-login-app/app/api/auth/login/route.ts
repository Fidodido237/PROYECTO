import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {

    const body = await request.json();
   
    return NextResponse.json(
      { 
        message: "Petición POST recibida. Endpoint de autenticación activo (Modo Desarrollo).", 
        datosRecibidos: body 
      }, 
      { status: 200 }
    );
  } catch (error) {
 
    return NextResponse.json(
      { error: "Hubo un error al procesar la solicitud en el servidor" }, 
      { status: 500 } // Código 500 significa "Error interno del servidor"
    );
  }
}