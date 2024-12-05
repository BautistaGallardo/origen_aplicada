"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import TurnoModal from "./reservation";

const DashboardPatient = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Estado para controlar el modal
  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);

  const openTurnoModal = () => setIsTurnoModalOpen(true);
  const closeTurnoModal = () => setIsTurnoModalOpen(false);

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
              <button
                onClick={openTurnoModal}
                className="block w-full py-2 px-4 bg-white-300 text-left rounded hover:bg-gray-400"
              >
                Reservar un Turno
              </button>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 bg-white-300 rounded hover:bg-gray-400"
              >
                Historial de Turnos
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Modal de Turno */}
      {isTurnoModalOpen && (
        <TurnoModal isOpen={isTurnoModalOpen} onClose={closeTurnoModal} />
      )}
    </div>
  );
};

export default DashboardPatient;
