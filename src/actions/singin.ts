import { LoginPacienteSchema, LoginProfesionalSchema } from "@/libs/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";

export const loginAction = async (
    values: z.infer<typeof LoginPacienteSchema> | z.infer<typeof LoginProfesionalSchema>
) => {
    try {
        // Autenticación mediante next-auth
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        // Maneja el caso de error en las credenciales
        if (!result || result.error) {
            return { success: false, error: "Error en el inicio de sesión: credenciales incorrectas" };
        }

        // Retorna un objeto consistente
        return { success: true, result };
    } catch (error) {
        console.error(error); // Registro en consola para diagnóstico

        // Devuelve un mensaje de error específico o genérico
        const errorMessage =
            error instanceof Error ? error.message : "Error inesperado en el inicio de sesión";
        return { success: false, error: errorMessage };
    }
};
