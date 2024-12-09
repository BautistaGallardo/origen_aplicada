'use server'
import { z } from "zod";
import { RegisterPacienteSchema, RegisterProfesionalSchema, RegisterAdminSchema } from "@/libs/zod";
import { hash } from "bcryptjs";

import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export const registerPatientAction = async (values: z.infer<typeof RegisterPacienteSchema>) => {
    try {
        // Validar si el usuario ya existe
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: values.email },
                    { phone_number: values.phone_number },
                    { TypeIdCard: { id_number: values.id_card } }, 
                ],
            },
            include: { TypeIdCard: true }, 
        });

        if (existingUser?.email === values.email) {
            throw new Error("El correo electrónico ya está en uso");
        }
        if (existingUser?.phone_number === values.phone_number) {
            throw new Error("El número de teléfono ya está en uso");
        }
        if (existingUser?.TypeIdCard?.id_number === values.id_card) {
            throw new Error("El documento de identidad ya está en uso");
        }

        // Usar una transacción para garantizar consistencia
        const newUser = await db.$transaction(async (tx) => {
            const hashedPassword = await hash(values.password, 10);

            // Crear usuario
            const user = await tx.user.create({
                data: {
                    email: values.email,
                    password: hashedPassword,
                    name: values.name,
                    lastName: values.lastname,
                    phone_number: values.phone_number,
                    date_of_birth: values.date_of_birth,
                },
            });

            // Crear paciente
            await tx.patients.create({
                data: {
                    userId: user.id,
                    photo: values.photo, // opcional
                },
            });

            // Crear tipo de identificación
            await tx.typeIdCard.create({
                data: {
                    userId: user.id,
                    type: values.type_id_card,
                    id_number: values.id_card,
                },
            });

            return user;
        });

        return newUser;
    } catch (error: any) {
        console.error("Error al registrar paciente:", error.message);
        throw new Error(error.message || "Ocurrió un error inesperado");
    }
};



export const registerProfessinalAction = async(values: z.infer<typeof RegisterProfesionalSchema>) =>{
    try {
        const existingUser = await db.user.findUnique({
            where: { email: values.email },
            include:{
                TypeIdCard:true
            }
        });

        if (existingUser) {

            const checkUser = {
                document:values.id_card,
                phone:values.phone_number
            }

            if (existingUser.TypeIdCard?.id_number === checkUser.document && existingUser.phone_number === checkUser.phone){
                const professinal = await db.professional.create({
                    data: {
                        userId: existingUser.id,
                        photo: values.photo, // opcional
                        specialty:values.specialty
        
                    },
                });

                return {existingUser,professinal}
            }

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


export const registerAdminAction = async(values: z.infer<typeof RegisterAdminSchema>) =>{

    const existingAdmin = await db.adminUser.findUnique({
        where: { email: values.email },
    });

    const hashedPassword = await hash(values.password, 10);

    const newAdmin = await db.adminUser.create({
        data: {
            email: values.email,
            password: hashedPassword,
            name: values.name,
        },
    });

}
