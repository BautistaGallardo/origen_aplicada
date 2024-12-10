'use server'
import { z } from "zod";
import { RegisterPacienteSchema, RegisterProfesionalSchema, RegisterAdminSchema } from "@/libs/zod";
import { hash } from "bcryptjs";

import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export const registerPatientAction = async (values: z.infer<typeof RegisterPacienteSchema>) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: values.email },
                    { phone_number: values.phone_number },
                    { TypeIdCard: { id_number: values.id_card } },
                ],
            },
            include: { TypeIdCard: true, professional: true }, // Incluye tabla de profesionales
        });

        if (existingUser) {
            if(!existingUser.date_of_birth){return 'throw new Error("Fecha de nacimiento nula");'}
            // Validar que todos los campos coincidan
            const isSameUser =
                existingUser.email === values.email &&
                existingUser.phone_number === values.phone_number &&
                existingUser.TypeIdCard?.id_number === values.id_card &&
                existingUser.name === values.name &&
                existingUser.lastName === values.lastname &&
                existingUser.date_of_birth.toISOString() === values.date_of_birth.toISOString();

            if (!isSameUser) {
                throw new Error("Los datos proporcionados no coinciden con los del usuario existente.");
            }

            // Si el usuario ya es un profesional, regístralo como paciente
            if (existingUser.professional) {
                const isAlreadyPatient = await db.patients.findFirst({
                    where: { userId: existingUser.id },
                });

                if (isAlreadyPatient) {
                    throw new Error("El usuario ya está registrado como paciente.");
                }

                // Crear entrada en la tabla de pacientes
                const newPatient = await db.patients.create({
                    data: {
                        userId: existingUser.id,
                        photo: values.photo || null, // Foto opcional
                    },
                });

                return newPatient;
            }
        }

        // Si el usuario no existe, crea uno nuevo
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
                    photo: values.photo || null, // Foto opcional
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




export const registerProfessinalAction = async (values: z.infer<typeof RegisterProfesionalSchema>) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: values.email },
                    { phone_number: values.phone_number },
                    { TypeIdCard: { id_number: values.id_card } },
                ],
            },
            include: { TypeIdCard: true, patient: true }, // Incluye tabla de pacientes
        });

        if (existingUser) {
            if(!existingUser.date_of_birth){return 'throw new Error("Fecha de nacimiento nula");'}
            // Validar que todos los datos coincidan
            const isSameUser =
                existingUser.email === values.email &&
                existingUser.phone_number === values.phone_number &&
                existingUser.TypeIdCard?.id_number === values.id_card

                if (!isSameUser) {
                    console.error("Datos del usuario existente:", existingUser);
                    console.error("Datos proporcionados:", values);
                    throw new Error("Los datos proporcionados no coinciden con los del usuario existente.");
                }

            // Si el usuario ya es un paciente
            if (existingUser.patient) {
                // Verifica si ya está registrado como profesional
                const isAlreadyProfessional = await db.professional.findFirst({
                    where: { userId: existingUser.id },
                });

                if (isAlreadyProfessional) {
                    throw new Error("El usuario ya está registrado como profesional.");
                }

                // Registrar al usuario en la tabla de profesionales
                const newProfessional = await db.professional.create({
                    data: {
                        userId: existingUser.id,
                        photo: values.photo || null, // Foto opcional
                        specialty: values.specialty,
                    },
                });

                return { existingUser, newProfessional };
            }
        }

        // Si el usuario no existe, crea uno nuevo
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

            // Crear profesional
            await tx.professional.create({
                data: {
                    userId: user.id,
                    photo: values.photo || null, // Foto opcional
                    specialty: values.specialty,
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
        console.error("Error al registrar profesional:", error.message);
        throw new Error(error.message || "Ocurrió un error inesperado");
    }
};



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
