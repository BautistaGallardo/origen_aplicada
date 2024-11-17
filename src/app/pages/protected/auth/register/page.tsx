"use client"
import React, { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import {RegisterPacienteSchema} from '@/libs/zod'
import {registerPatientAction} from '@/actions/auth-action'
import { useRouter } from "next/navigation";



// Definición del esquema de validación usando Zod
const formSchema = RegisterPacienteSchema

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date);
  const route = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastname: "",
      password: "",
      email: "",
      phone_number: "",
      date_of_birth: selectedDate,
      type_id_card: "",
      id_card: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null)
      const response = await registerPatientAction(values);
      if (response) {
        route.push("/")
      } else {
        setError("Error al registrar. Inténtalo de nuevo.");
      }
    } catch (error) {
      setError("Ocurrió un error. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-black-600 mb-4">Regístrate</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Completa todos los campos requeridos
      </p>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SignupFormField
            name="name"
            label="Nombre"
            placeholder="Tu nombre"
            formControl={form.control}
          />
          <SignupFormField
            name="lastname"
            label="Apellido"
            placeholder="Tu apellido"
            formControl={form.control}
          />
          <SignupFormField
            name="email"
            label="Email"
            placeholder="Email"
            inputType="email"
            formControl={form.control}
          />
          <SignupFormField
            name="password"
            label="Contraseña"
            placeholder="Contraseña"
            inputType="password"
            formControl={form.control}
          />
          <SignupFormField
            name="phone_number"
            label="Teléfono"
            placeholder="Teléfono"
            formControl={form.control}
          />
          <SignupFormField
            name="id_card"
            label="Documento"
            placeholder="Documento"
            formControl={form.control}
          />
          <SignupFormField
            name="type_id_card"
            label="Nacionalidad"
            placeholder="Nacionalidad"
            formControl={form.control}
          />
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input
               type="date"
               onChange={(e) => setSelectedDate(new Date(e.target.value))}
               className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full mt-4">Registrarse</Button>
        </form>
      </Form>
    </div>
  );
};

interface SignupFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<z.infer<typeof formSchema>, any>;
}



const SignupFormField: React.FC<SignupFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...field}
              value={field.value instanceof Date ? field.value.toISOString().slice(0, 10) : field.value}
            />
          </FormControl>
          {description && <FormDescription className="text-gray-500 text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SignupForm;
