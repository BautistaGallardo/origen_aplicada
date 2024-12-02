"use client";

import React, { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Definición del esquema de validación usando Zod
const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  nombre: z.string(),
  apellido: z.string(),
  telefono: z.string(),
  documento: z.string(),
  nacionalidad: z.string(),
  fechaNacimiento: z.string(),
  especialidad: z.string(),
  foto: z.instanceof(File).optional(),
});

const SignupForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      nombre: "",
      apellido: "",
      telefono: "",
      documento: "",
      nacionalidad: "",
      fechaNacimiento: "",
      especialidad: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("nombre", values.nombre);
    formData.append("apellido", values.apellido);
    formData.append("telefono", values.telefono);
    formData.append("documento", values.documento);
    formData.append("nacionalidad", values.nacionalidad);
    formData.append("fechaNacimiento", selectedDate ? selectedDate.toISOString() : "");
    formData.append("especialidad", values.especialidad);
    if (selectedFile) formData.append("foto", selectedFile);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Registration successful");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-black-600 mb-4">Regístrate</h2>
      <p className="text-sm text-center text-gray-500 mb-6">Completa todos los campos requeridos</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <SignupFormField
            name="nombre"
            label="Nombre"
            placeholder="Tu nombre"
            formControl={form.control}
          />
          <SignupFormField
            name="apellido"
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
            name="telefono"
            label="Teléfono"
            placeholder="Teléfono"
            formControl={form.control}
          />
          <SignupFormField
            name="documento"
            label="Documento"
            placeholder="Documento"
            formControl={form.control}
          />
          <SignupFormField
            name="nacionalidad"
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
          <FormField
            control={form.control}
            name="especialidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Especialidad</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={cn("w-full")}>
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nutricion">Nutrición</SelectItem>
                    <SelectItem value="Psicologia">Psicología</SelectItem>
                    <SelectItem value="Psiquiatria">Psiquiatría</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Foto de perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) setSelectedFile(e.target.files[0]);
              }}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Registrarse
          </Button>
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
  if (name === "foto") {
    // Campo personalizado para archivos
    return (
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">{label}</FormLabel>
            <FormControl>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    // Actualizamos el valor con el archivo seleccionado
                    field.onChange(e.target.files[0]);
                  }
                }}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormControl>
            {description && (
              <FormDescription className="text-gray-500 text-xs">{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Campo estándar
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
            />
          </FormControl>
          {description && (
            <FormDescription className="text-gray-500 text-xs">{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


export default SignupForm;
