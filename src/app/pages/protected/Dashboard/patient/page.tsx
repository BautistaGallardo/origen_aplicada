"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import TurnoTable from "./table";
import TurnoModal from "./reservation";

const DashboardPatient = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "historial">(
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
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Reservar un Turno
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("historial")}
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Historial de Turnos
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="w-full text-left px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
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
              Bienvenido al Portal de Paciente
            </h2>
            <p className="text-gray-700">
              Aquí puedes gestionar tus turnos y revisar tu información.
            </p>
          </div>
        )}
        {currentView === "historial" && (
          <div className=" h-full">
            <h2 className="text-2xl font-bold mb-4">Historial de Turnos</h2>
            <TurnoTable refreshKey={refreshKey} />
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

export default DashboardPatient;
