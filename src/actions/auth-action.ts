'use server'
import { date, z } from "zod";
import { LoginPacienteSchema, LoginProfesionalSchema, RegisterPacienteSchema, RegisterProfesionalSchema } from "@/libs/zod";
import { signIn } from "next-auth/react";
import { db } from "@/libs/db";
import { hash, compare } from "bcryptjs";

// Accion de Login
export const loginAction = async (
    values: z.infer<typeof LoginPacienteSchema> | z.infer<typeof LoginProfesionalSchema>
) => {
    try {
        const user = await db.user.findUnique({
            where: { email: values.email },
            include: {
                paciente: true,
                profesional: true,
            },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const isPaciente = !!user.paciente;
        const isProfesional = !!user.profesional;

        if (!isPaciente && !isProfesional) {
            throw new Error("El usuario no tiene roles asignados");
        }

        // Verificación de la contraseña
        const isPasswordValid = await compare(values.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Error en el inicio de sesión: credenciales incorrectas");
        }

        // Determinar la URL de redirección según el rol
        let callbackUrl = "";
        if (isPaciente && isProfesional) {
            callbackUrl = "/pages/dashboard/selectRole";
        } else if (isPaciente) {
            callbackUrl = "/pages/dashboard/paciente";
        } else if (isProfesional) {
            callbackUrl = "/pages/dashboard/profesional";
        }

        // Autenticación mediante next-auth
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (!result || result.error) {
            throw new Error("Error en el inicio de sesión: credenciales incorrectas");
        }

        // Retornar la URL para redirección y los roles del usuario
        return {
            roles: {
                paciente: isPaciente,
                profesional: isProfesional,
            },
            callbackUrl,
        };
    } catch (error: any) {
        throw new Error(error.message || "Ocurrió un error inesperado");
    }
};

// Acción de Registro
export const registerPatientAction = async (
    values: z.infer<typeof RegisterPacienteSchema> | z.infer<typeof RegisterProfesionalSchema>
) => {
    try {
        const existingUser = await db.user.findUnique({
            where: { email: values.email },
        });

        if (existingUser) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await hash(values.password, 10);

        // Crear el usuario en la tabla `user`
        const newUser = await db.user.create({
            data: {
                email: values.email,
                password: hashedPassword,
                name: values.name,
                lastname: values.lastname,
                phone_number: values.phone_number,
                date_of_birth: values.date_of_birth,
            },
        });

        // Verificar tipo y crear entradas correspondientes en las tablas relacionadas
        if ("date_of_birth" in values) {
            await db.paciente.create({
                data: {
                    user_id: newUser.id,
                    photo: values.photo,
                    ...values,
                },
            });
        }

        if ("type_id_card" in values) {
            await db.typeIdCard.create({
                data: {
                    user_id: newUser.id,
                    type: values.type_id_card,
                    id_number: values.id_card,
                    ...values,
                },
            });
        }

        return newUser;
    } catch (error: any) {
        throw new Error(error.message || "Ocurrió un error inesperado");
    }
};
