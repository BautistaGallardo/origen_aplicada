'use client';
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Introduccion = () => {
  return (
    <div
      id="inicio" // Agregamos el identificador para enlazar desde el menú
      className="bg-white text-black min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-wider">
          En manos de PROFESIONALES
        </h1>
        <p className="text-lg">
          Somos Gisela y Luis, directores de Origen, centro de especialidades médicas, apostamos a un lugar que acompañe desde el compromiso y la responsabilidad.
        </p>
        <Link
          href="pages/protected/auth/login"
          className="inline-block px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
        >
          Pedir Turno
        </Link>
      </div>
    </div>
  );
};

export default Introduccion;
