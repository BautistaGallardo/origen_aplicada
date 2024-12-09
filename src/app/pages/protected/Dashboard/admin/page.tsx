"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import TurnoTableProfessional from "./tableProfessional";
import TurnoPatient from "./tablePatient"

import TurnoModal from "./reservation";

const DashboardAdmin = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "historialProfessional"| "historialPatient">(
    "dashboard"
  );

  // Estado para refrescar la tabla
  const [refreshKey, setRefreshKey] = useState(0);

  const openTurnoModal = () => setIsTurnoModalOpen(true);
  const closeTurnoModal = () => setIsTurnoModalOpen(false);

  // Callback para manejar el refresco de la tabla
  const handleTurnoCreated = () => {
    setRefreshKey((prev) => prev + 1);
    closeTurnoModal();
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
          <ul className="space-y-4">
            <li>
              <button
                onClick={openTurnoModal}
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
              >
                Reservar un Turno
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("historialPatient")}
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
              >
                Pacientes
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("historialProfessional")}
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
              >
                Profesionales
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="w-full text-left px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-center"
              >
                Volver al Dashboard
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-6 space-y-4">
        {currentView === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold">
              Bienvenido al Dashboard de Admin
            </h2>
            <p className="text-gray-700">
              Aquí puedes gestionar los distintos usuarios de la aplicación.
            </p>
          </div>
        )}
        {currentView === "historialProfessional" && (
          <div className=" h-full">
            <TurnoTableProfessional refreshKey={refreshKey} onTurnoCreated={handleTurnoCreated}/>
          </div>
        )}
        {currentView === "historialPatient" && (
          <div className=" h-full">
            <TurnoTableProfessional refreshKey={refreshKey} onTurnoCreated={handleTurnoCreated}/>
          </div>
        )}
      </main>

      {/* Modal de Turno */}
      {isTurnoModalOpen && (
        <TurnoModal
          isOpen={isTurnoModalOpen}
          onClose={closeTurnoModal}
          onTurnoCreated={handleTurnoCreated} // Pasamos el callback
        />
      )}
    </div>
  );
};

export default DashboardAdmin;