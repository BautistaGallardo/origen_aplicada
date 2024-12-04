"use client";
import React, { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/actions/singin";
import { LoginPacienteSchema } from "@/libs/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const route = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const values = LoginPacienteSchema.parse({ email, password });
      const response = await loginAction(values);

      console.log(session)
  
      if (response.success) { // Verifica si es exitoso
        route.push('/pages/protected/Dashboard/patient')
      } else if (response.error) { // Captura errores específicos
        setError(response.error);
      } else {
        setError("Error desconocido en el inicio de sesión.");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError("Por favor, verifica los datos ingresados.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-black-600 mb-4">Iniciar Sesión</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Introduce tus credenciales para acceder
      </p>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <SignupFormField
          label="Email"
          placeholder="Ingresa tu email"
          inputType="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SignupFormField
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          inputType="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">Iniciar Sesión</Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <a
            href="/pages/protected/auth/register"
            className="text-blue-600 hover:underline"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
    
  );
};

// Componente reutilizable para los campos de entrada
interface SignupFormFieldProps {
  label: string;
  placeholder: string;
  inputType?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignupFormField: React.FC<SignupFormFieldProps> = ({
  label,
  placeholder,
  inputType,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Input
        placeholder={placeholder}
        type={inputType || "text"}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default LoginForm;
