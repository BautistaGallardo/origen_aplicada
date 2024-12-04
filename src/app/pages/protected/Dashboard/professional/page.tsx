"use client";
import React, { useState } from "react";
//import AddTurnoModal from "./TurnoModal";
//import TurnosTable from "./TurnoTable";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const DashboardProfessional = () => {

  return (
    <div className="min-h-screen bg-white text-black">
      <aside className="w-64 bg-gray-100 p-4 h-screen fixed">
        <h2 className="text-lg font-bold mb-4">Portal de Paciente</h2>
        <nav>
          <ul>
            <li>
              <a
                href="#"
                className="block py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
              >
                Pacientes
              </a>
            </li>
          </ul>
        </nav>
        <button
              onClick={() => signOut({callbackUrl: "/"})}
              className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
            >
              Cerrar Sesión
            </button>
      </aside>
      
    </div>
  );
};

export default DashboardProfessional;
