import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginPacienteSchema, LoginAdminSchema } from "@/libs/zod";
import { db } from "@/libs/db";
import bcrypt from "bcryptjs";

// This is the object configuration, not the full Auth.js instance
export default {
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            id: "user-login", // Identificador del proveedor
            name: "User Login",
            authorize: async (credentials) => {
                // Validar las credenciales con el esquema de Zod
                const parsed = LoginPacienteSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new Error("Invalid credentials");
                }
            
                const { email, password } = parsed.data;
            
                // Obtener el usuario de la base de datos
                const user = await db.user.findUnique({
                    where: { email },
                    include: {
                        patient: true,
                        professional: true,
                    },
                });
            
                if (!user) {
                    throw new Error("No user found");
                }
            
                // Verificar si el estado del usuario es 'false', lo que significa que la cuenta está desactivada
                if (!user.state) {
                    throw new Error("User account is deactivated");
                }
            
                // Verificar si la contraseña coincide con la contraseña encriptada
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    throw new Error("Invalid password");
                }
            
                // Validar los roles solo si el estado es 'true'
                const isPaciente = user.patient && user.patient.state;
                const isProfesional = user.professional && user.professional.state;
            
                if (!isPaciente && !isProfesional) {
                    throw new Error("User has no active roles assigned");
                }
            
                // Establecer el rol basado en los roles activos del usuario
                const role = isPaciente && isProfesional ? "Patient and Professional" 
                            : isPaciente ? "Patient" 
                            : "Professional";
            
                // Crear el objeto de usuario con su rol y retornarlo
                const userWithRole = {
                    ...user,
                    role,
                };
                return userWithRole;
            },
        }),
        Credentials({
            id: "admin-login", // Identificador del proveedor
            name: "Admin Login",
            authorize: async (credentials) => {
                const parsed = LoginPacienteSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new Error("Invalid credentials");
                }

                const { email, password } = parsed.data;


                // Buscar administrador en la tabla `admin`
                const admin = await db.adminUser.findUnique({
                    where: { email },
                });

                if (!admin) {
                    throw new Error("No admin found");
                }

                // Verificar contraseña
                const passwordMatch = await bcrypt.compare(password, admin.password);
                if (!passwordMatch) {
                    throw new Error("Invalid password");
                }

                // Retornar administrador con rol
                return { ...admin, role: "Admin" };
            },
        }),
    ],
} satisfies NextAuthConfig;
