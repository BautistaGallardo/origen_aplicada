"use client";
import React, { useState } from "react";
import AddTurnoModal from "./TurnoModal";
import TurnosTable from "./TurnoTable";
import { Button } from "@/components/ui/button";
import {signOut} from "next-auth/react"
const PacienteDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      <aside className="w-64 bg-gray-100 p-4 h-screen fixed">
        <h2 className="text-lg font-bold mb-4">Usuario</h2>
        <nav>
          <ul>
            <li>
              <a
                href="/"
                className="block py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
              >
                Paciente
              </a>
            </li>
          </ul>
        </nav>
        <Button 
          className="mt-4 w-full" 
          variant="secondary"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Salir
        </Button>
      </aside>
      <main className="ml-64 p-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Hola, Rocío</h1>
          <Button onClick={() => setIsModalOpen(true)}>+ Añadir Turno</Button>
        </header>
        <TurnosTable />
        <AddTurnoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
};

export default PacienteDashboard;
