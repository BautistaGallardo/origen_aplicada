'use server'
import { z } from "zod";
import { RegisterPacienteSchema, RegisterProfesionalSchema } from "@/libs/zod";
import { db } from "@/libs/db";
import { hash } from "bcryptjs";

export const registerPatientAction = async (
    values: z.infer<typeof RegisterPacienteSchema>) => {
    try {
        const existingUser = await db.user.findUnique({
            where: { email: values.email },
        });

        if (existingUser) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await hash(values.password, 10);

        // Crea el usuario en la tabla user
        const newUser = await db.user.create({
            data: {
                email: values.email,
                password: hashedPassword,
                name: values.name,
                lastName: values.lastname,
                phone_number: values.phone_number,
                date_of_birth: values.date_of_birth,
            },
        });
        
        // Crea el registro en la tabla paciente
        const patient = await db.patients.create({
            data: {
                userId: newUser.id,
                photo: values.photo, // opcional
            },
        });

        // Crea el registro en la tabla de tipo de ID si se proporciona
       const typeIdCard = await db.typeIdCard.create({
            data: {
                userId: newUser.id,
                type: values.type_id_card,
                id_number: values.id_card,
                    
            },
        });
        

        return newUser;
    } catch (error: any) {
        throw new Error(error.message || "Ocurrió un error inesperado");
    }
};


export const registerProfessinalAction = async(values: z.infer<typeof RegisterProfesionalSchema>) =>{
    try {
        const existingUser = await db.user.findUnique({
            where: { email: values.email },
        });

        if (existingUser) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await hash(values.password, 10);

        // Crea el usuario en la tabla user
        const newUser = await db.user.create({
            data: {
                email: values.email,
                password: hashedPassword,
                name: values.name,
                lastName: values.lastname,
                phone_number: values.phone_number,
                date_of_birth: values.date_of_birth,
            },
        });
        
        // Crea el registro en la tabla paciente
        const professinal = await db.professional.create({
            data: {
                userId: newUser.id,
                photo: values.photo, // opcional
                specialty:values.specialty

            },
        });

        // Crea el registro en la tabla de tipo de ID si se proporciona
       const typeIdCard = await db.typeIdCard.create({
            data: {
                userId: newUser.id,
                type: values.type_id_card,
                id_number: values.id_card,
                    
            },
        });
        

        return newUser;
    } catch (error: any) {
        throw new Error(error.message || "Ocurrió un error inesperado");
    }
}