import { z } from "zod";

// Esquema Zod para el registro de Paciente
export const RegisterPacienteSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  email: z.string().email("Correo electrónico no válido"),
  phone_number: z.string(), 
  date_of_birth: z.date(),
  photo: z.string().url().optional(),
  type_id_card: z.string().min(1, "El tipo de documento es obligatorio"),
  id_card: z.string().min(1, "El número de documento es obligatorio"),
});

// Esquema Zod para el login de Paciente
export const LoginPacienteSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Esquema Zod para el registro de Profesional
export const RegisterProfesionalSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  email: z.string().email("Correo electrónico no válido"),
  phone_number: z.string(), 
  date_of_birth: z.date(),
  specialty: z.string().min(1, "La especialidad es obligatoria"),
  photo: z.string().url().optional(),
  type_id_card: z.string().min(1, "El tipo de documento es obligatorio"),
  id_card: z.string().min(1, "El número de documento es obligatorio"),
});

// Esquema Zod para el login de Profesional
export const LoginProfesionalSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegisterPaciente = z.infer<typeof RegisterPacienteSchema>;
export type LoginPaciente = z.infer<typeof LoginPacienteSchema>;
export type RegisterProfesional = z.infer<typeof RegisterProfesionalSchema>;
export type LoginProfesional = z.infer<typeof LoginProfesionalSchema>;