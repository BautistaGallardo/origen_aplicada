"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
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
    <div className="min-h-screen flex bg-custom-lightGray text-custom-blueGray">
      {/* Sidebar */}
      <aside className="bg-custom-white shadow-lg w-64 fixed h-full">
        <div className="p-6 border-b border-custom-blueGray">
          {isAuthenticated && (
            <div className="space-y-4">
              {/* Saludo */}
              <div className="flex items-center space-x-4">
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <h1 className="text-2xl font-bold text-blueGray">
                  Hola, {session?.user?.name || "Usuario"}
                </h1>
              </div>

              {/* Botón cerrar sesión */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full px-4 py-2 text-white bg-custom-orange rounded-md hover:bg-opacity-80"
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
                className="w-full text-left px-4 py-2 bg-custom-blueGray text-white rounded-md hover:bg-opacity-80"
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
            <h2 className="text-2xl font-bold text-custom-blueGray">
              Bienvenido al Portal del Profesional
            </h2>
            <p className="text-custom-blueGray">
              Selecciona una opción del menú lateral.
            </p>
          </div>
        )}

        {/* Historial de pacientes */}
        {view === "historial" && (
          <div className="space-y-4 h-screen">
            <TurnoTable refreshKey={refreshKey} onTurnoCreated={handleTurnoCreated} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardProfessional;
