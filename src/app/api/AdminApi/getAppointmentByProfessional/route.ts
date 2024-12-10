import { db } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { subDays } from "date-fns"; // Importa una utilidad para manejar fechas

export async function GET(req: NextRequest) {
    try {
        const professional_id = req.nextUrl.searchParams.get("id");

        // Validación del parámetro de entrada
        if (!professional_id || professional_id.trim() === "") {
            return NextResponse.json(
                { success: false, error: "Professional ID is required", data: null },
                { status: 400 }
            );
        }

        // Buscar el profesional
        const professional = await db.professional.findUnique({
            where: { id: professional_id },
        });

        if (!professional) {
            return NextResponse.json(
                { success: false, error: "Professional not found", data: null },
                { status: 404 }
            );
        }

        // Fecha límite: Últimos 30 días
        const thirtyDaysAgo = subDays(new Date(), 30);

        // Buscar citas asociadas dentro del rango
        const appointments = await db.appointment.findMany({
            where: {
              professional_id: professional.id,
              date: {
                gte: thirtyDaysAgo,
              },
            },
            include: {
              Reservations: {
                include: {
                  Patient: {
                    include:{
                        User:{
                            select:{
                                name:true,
                                lastName:true
                            }
                        }
                    }
                  },
                },
              },
            },
            orderBy: { date: "desc" },
          });
          

        return NextResponse.json(
            { success: true, error: null, data: appointments },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in appointments API:", error);

        return NextResponse.json(
            { success: false, error: "Internal Server Error", data: null },
            { status: 500 }
        );
    }
}
