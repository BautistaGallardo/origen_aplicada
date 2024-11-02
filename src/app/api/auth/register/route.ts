import { NextRequest, NextResponse } from "next/server";
import { RegisterPacienteSchema } from '@/libs/zod';
import { db } from '@/libs/db';
import { ZodError } from "zod";
import { hash } from "bcryptjs";

export default async function POST(req: NextRequest) {
    try {
        const data = RegisterPacienteSchema.parse(await req.json());

        // Hasheamos la contraseña antes de guardar al usuario
        const hashedPassword = await hash(data.password, 10);

        const user = await db.user.create({
            data: {
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                password: hashedPassword, 
                phone_number: data.phone_number,
                date_of_birth: data.date_of_birth,
                photo: data.photo,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error:any) {
        if (error instanceof ZodError) {
            // Si el error es de validación, devolvemos el mensaje adecuado
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        // Otros errores
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
