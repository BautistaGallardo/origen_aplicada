import { db } from "@/libs/db";
import { error } from "console";
import { tree } from "next/dist/build/templates/app-page";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    //const body = req.nextUrl.searchParams.get()
    try {
        const professionals = await db.professional.findMany({
            select: {
                id: true, // Campos directamente de "professional"
                specialty:true,
                state:true,
                User: { // Relación con "User"
                    select: { // Todo debe estar dentro de `select`
                        id: true,
                        name: true,
                        lastName: true,
                        state: true,
                        email: true,
                        phone_number: true,
                        TypeIdCard: { // Relación anidada con "TypeIdCard"
                            select: {
                                id_number: true
                            }
                        }
                    }
                }
            }
        });
        
    
        console.log("Professionals:", professionals); // <-- Aquí inspeccionas qué está devolviendo
        if (!professionals || professionals.length === 0) {
            return NextResponse.json({ error: "Professionals not found" }, { status: 400 });
        }

        console.log(professionals)
        return NextResponse.json(professionals);
    } catch (error) {
        console.error("Error en la API de appointments:", error);
        return NextResponse.json({ error: "Error Interno del Servidor" }, { status: 500 });
    }    
    
}