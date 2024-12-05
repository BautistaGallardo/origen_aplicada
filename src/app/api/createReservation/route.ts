import { NextResponse } from "next/server";
import { db } from "@/libs/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appointment_id, patient_id, date, state } = body;

    // Validar que todos los datos estén presentes
    if (!appointment_id || !patient_id || !date || !state) {
      console.error("Datos faltantes:", { appointment_id, patient_id, date, state });
      return NextResponse.json(
        { error: "Faltan datos requeridos para crear la reserva." },
        { status: 400 }
      );
    }

    // Verificar que el turno (appointment_id) exista
    const appointment = await db.appointment.findUnique({
      where: { id: appointment_id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "El turno especificado no existe." },
        { status: 400 }
      );
    }

    // Verificar que el paciente (patient_id) exista
    const patient = await db.patients.findUnique({
      where: { id: patient_id },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "El paciente especificado no existe." },
        { status: 400 }
      );
    }

    // Crear la reserva
    const newReservation = await db.reservation.create({
      data: {
        appointment_id,
        patient_id,
        date: new Date(date),
        state,
      },
    });

    console.log("Reserva creada:", newReservation);
    return NextResponse.json({ success: true, reservation: newReservation });
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json(
      { error: "Error interno al crear la reserva." },
      { status: 500 }
    );
  }
}

  