import { NextResponse } from "next/server";
import { db } from "@/libs/db";

// Define el tipo para los turnos
type Turno = {
  date: string;
  hours: string[];
};

// Define el tipo para las especialidades, profesionales y turnos
type Profesional = {
  id: string;
  name: string | null;
  email: string | null;
  availableTurns: Turno[];
};

type Especialidad = {
  specialty: string;
  professionals: Profesional[];
};

export async function GET() {
  try {
    // Consulta para obtener profesionales, especialidades y turnos disponibles
    const profesionales = await db.professional.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Appointments: {
          where: {
            state: "disponible", // Filtrar solo turnos disponibles
          },
          select: {
            date: true,
            hour: true,
          },
        },
      },
    });

    // Transformar los datos con tipo explícito para el acumulador
    const especialidades: Especialidad[] = profesionales.reduce((acc: Especialidad[], prof) => {
      const { specialty, User, Appointments } = prof;

      // Validar que el usuario asociado al profesional existe
      if (!User) {
        console.warn(`Profesional sin usuario asociado: ${prof.id}`);
        return acc; // Saltar si no hay usuario
      }

      // Agrupar los turnos disponibles por fecha
      const availableTurns = Appointments.reduce((turnAcc: Turno[], appointment) => {
        const dateStr = new Date(appointment.date).toISOString().split("T")[0]; // Formato yyyy-MM-dd
        const existingTurn = turnAcc.find((turn) => turn.date === dateStr);
      
        if (existingTurn) {
          // Evitar duplicados en la lista de horarios
          if (!existingTurn.hours.includes(appointment.hour)) {
            existingTurn.hours.push(appointment.hour);
          }
        } else {
          turnAcc.push({
            date: dateStr,
            hours: [appointment.hour],
          });
        }
      
        return turnAcc;
      }, []);

      // Buscar si la especialidad ya existe en el acumulador
      const especialidadExistente = acc.find((esp) => esp.specialty === specialty);

      if (especialidadExistente) {
        // Si la especialidad ya existe, agregar el profesional a la lista
        especialidadExistente.professionals.push({
          id: User.id,
          name: User.name,
          email: User.email,
          availableTurns,
        });
      } else {
        // Si no existe, crear una nueva entrada para la especialidad
        acc.push({
          specialty: specialty,
          professionals: [
            {
              id: User.id,
              name: User.name,
              email: User.email,
              availableTurns,
            },
          ],
        });
      }

      return acc;
    }, []); // Tipo inicializado como array vacío de `Especialidad[]`

    // Responder con las especialidades agrupadas y turnos
    return NextResponse.json(especialidades);
  } catch (error) {
    console.error("Error al obtener profesionales:", error);
    return NextResponse.json(
      { error: "Error al obtener profesionales y turnos" },
      { status: 500 }
    );
  }
}

