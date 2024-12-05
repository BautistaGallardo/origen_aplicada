// import { NextRequest, NextResponse } from "next/server";
// import type { DiaLaborable } from "@/actions/rutine_generate";
// import { db } from "@/libs/db";
// import { RutineGenerate,insertAppointment } from "@/actions/rutine_generate";

// export async function POST(req: NextRequest) {
//   try {
//     // Verifica que el cuerpo esté presente
//     if (!req.body) {
//       return NextResponse.json(
//         { message: "Request sin cuerpo" },
//         { status: 400 }
//       );
//     }

    


//     // Parsear el cuerpo como JSON
//     const data = (await req.json()) as DiaLaborable[];


//     const insert = insertAppointment(data)

//     return NextResponse.json(
//         {
//           message: "Datos recibidos correctamente",
//           data, // Devolver el objeto para validación
//         },
//         { status: 200 }
//       );

// } catch (error) {
//     console.error("Error procesando la solicitud:", error);
//     return NextResponse.json(
//       { message: "Error procesando la solicitud", error: 'Error de Create routine' },
//       { status: 500 }
//     );
//   }
// }
