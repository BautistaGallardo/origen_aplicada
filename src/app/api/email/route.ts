import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Procesar el cuerpo de la solicitud
    const { firstName, lastName, email, message } = await req.json();

    // Configura el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Cambia si usas otro servicio
      auth: {
        user: "rociomalanernst@gmail.com", // Tu correo
        pass: '', // Contraseña o App Password
      },
    });

    // Configura el contenido del correo
    const mailOptions = {
            from: `${firstName} ${lastName} <rociomalanernst@gmail.com>`, // Tu correo con el nombre del remitente
            to: 'rociomalanernst@gmail.com', // Correo donde recibes los mensajes
            subject: 'Nuevo mensaje desde el formulario de contacto',
            text: `
              Nombre: ${firstName} ${lastName}
              Correo del remitente: ${email}
              Mensaje: ${message}
            `,
            replyTo: email, // Esto asegura que cualquier respuesta vaya al remitente
          };
    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Correo enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return NextResponse.json({ success: false, message: 'Error al enviar el correo.' }, { status: 500 });
  }
}
