import { NextRequest, NextResponse } from "next/server";
import { db } from '@/libs/db';

export async function GET(req: NextRequest) {
    try {
        const data = req.nextUrl.searchParams.get('email');
    
        if (!data || typeof data !== "string") {
            return NextResponse.json({ error: "Email not found" }, { status: 400 });
        }
        
        const user = await db.user.findUnique({
            where: { email: data },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const reservation = await db.reservation.findMany({
            where: {
                patient_id: user.id,
            },
            include:{
                Appointment:{
                    select:{
                        date:true
                    }
                }  
            },
            orderBy: {
                date: "desc",
            },
        });

        if (reservation.length === 0) {
            return NextResponse.json({ message: "No hay reservaciones de este paciente en la base de datos" });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error("Error en la API de appointments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
