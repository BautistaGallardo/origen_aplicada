import { db } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    //const body = req.nextUrl.searchParams.get()
    try{
        const patients = db.patients.findMany({
            include:{
                User:true
            }
        })
    
        if(!patients){
            return NextResponse.json({error:'Professionals not found'},{status:400})
        }
    
        return NextResponse.json(patients)
    }catch(error){
        console.error("Error en la API de appointments:", error);
        return NextResponse.json({ error: "Error Interno del Servidor" }, { status: 500 });
    }
}