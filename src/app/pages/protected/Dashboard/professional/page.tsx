"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import WorkScheduleModal from "./laboral"; // Ajusta la ruta según la ubicación del archivo

const DashboardProfessional = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header con borde negro */}
      <div className="items-center max-w-screen-xl mx-auto md:flex border-b border-black">
        {/* Contenido para usuarios autenticados */}
        {isAuthenticated ? (
          <div className="flex items-center justify-between py-3 md:py-5 w-full">
            <h1 className="text-2xl font-semibold text-gray-800">
              Hola, {session?.user?.name || "Usuario"}
            </h1>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : null}
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white-100 p-4 h-screen fixed border-r border-black">
        <h2 className="text-lg font-bold mb-4">Portal de Paciente</h2>
        <nav>
          <ul>
            <li>
              {/* Trigger del modal */}
              <WorkScheduleModal />
            </li>
          </ul>
          <ul>
            <li>
              <a
                href="#"
                className="block py-2 px-4 bg-white-300 rounded hover:bg-gray-400"
              >
                Historial de Pacientes
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default DashboardProfessional;