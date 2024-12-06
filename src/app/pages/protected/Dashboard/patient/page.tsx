"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import TurnoTable from "./table"; // Asegúrate de importar tu componente TurnoTable
import TurnoModal from "./reservation";

const DashboardPatient = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Estado para controlar el modal
  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);

  // Estado para controlar qué sección mostrar
  const [currentView, setCurrentView] = useState<"dashboard" | "historial">(
    "dashboard"
  );

  const openTurnoModal = () => setIsTurnoModalOpen(true);
  const closeTurnoModal = () => setIsTurnoModalOpen(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header con borde negro */}
      <div className="items-center max-w-screen-xl mx-auto md:flex border-b border-black">
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
              <button
                onClick={openTurnoModal}
                className="block w-full py-2 px-4 bg-white-300 text-left rounded hover:bg-gray-400"
              >
                Reservar un Turno
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("historial")}
                className="block w-full py-2 px-4 bg-white-300 text-left rounded hover:bg-gray-400"
              >
                Historial de Turnos
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="block w-full py-2 px-4 bg-white-300 text-left rounded hover:bg-gray-400"
              >
                Volver al Dashboard
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="ml-64 p-4">
        {currentView === "dashboard" && (
          <div>
            <h2 className="text-xl font-bold">Bienvenido al Portal de Paciente</h2>
            <p>Aquí puedes gestionar tus turnos y revisar tu información.</p>
          </div>
        )}
        {currentView === "historial" && <TurnoTable />}
      </main>

      {/* Modal de Turno */}
      {isTurnoModalOpen && (
        <TurnoModal isOpen={isTurnoModalOpen} onClose={closeTurnoModal} />
      )}
    </div>
  );
};

export default DashboardPatient;