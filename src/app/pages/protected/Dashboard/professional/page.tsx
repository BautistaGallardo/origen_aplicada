"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import WorkScheduleModal from "./laboral"; // Ajusta la ruta según la ubicación del archivo
import TurnoTable from "./table"; // Ajusta la ruta si es necesario



const DashboardProfessional = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [view, setView] = useState<"default" | "historial">("default");
  const [refreshKey, setRefreshKey] = useState(0);

    // Callback para manejar el refresco de la tabla
    const handleTurnoCreated = () => {
      setRefreshKey((prev) => prev + 1);
    };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="bg-white shadow-lg w-64 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          {isAuthenticated && (
            <div className="space-y-4">
              {/* Saludo */}
              <h1 className="text-2xl font-bold text-gray-800">
                Hola, {session?.user?.name || "Usuario"}
              </h1>
              {/* Botón cerrar sesión */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
        <nav className="p-6 space-y-4">
          {/* Opciones del menú */}
          <ul className="space-y-4">
            <li>
              <WorkScheduleModal />
            </li>
            <li>
              <button
                onClick={() => setView("historial")}
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Historial de Pacientes
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-6">
        {/* Vista por defecto */}
        {view === "default" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bienvenido al Dashboard</h2>
            <p className="text-gray-700">Selecciona una opción del menú lateral.</p>
          </div>
        )}

        {/* Historial de pacientes */}
        {view === "historial" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Historial de Pacientes</h2>
            <TurnoTable refreshKey={refreshKey} onTurnoCreated={handleTurnoCreated}/>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardProfessional;