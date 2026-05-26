import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {

    const body = await request.json();
   
    return NextResponse.json(
      { 
        message: "¡Conexión exitosa! El backend recibió tus datos correctamente.", 
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