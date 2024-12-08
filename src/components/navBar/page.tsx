"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menus = [
    { title: "Inicio", anchor: "#inicio" },
    { title: "Sobre Nosotros", anchor: "#about" },
    { title: "Profesionales", anchor: "#professionals" },
    { title: "Contáctanos", anchor: "#contact" },
  ];

  const isAuthenticated = status === "authenticated";

  return (
    <nav className="bg-white w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex">
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
        ) : (
          <>
            {/* Contenido para usuarios no autenticados */}
            <div className="flex items-center justify-between py-3 md:py-5">
              <Link href="/">
                <h1 className="text-3xl font-bold text-gray-800">ORIGEN</h1>
              </Link>
              <div className="md:hidden">
                <button
                  className="text-gray-700 outline-none p-2 rounded-md focus:ring-2 focus:ring-gray-400"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <Menu />
                </button>
              </div>
            </div>
            {/* Menú de Navegación */}
            <div
              className={`flex-1 justify-self-end pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                menuOpen ? "block" : "hidden"
              }`}
            >
              <ul className="flex flex-col items-center space-y-8 md:flex-row md:justify-end md:space-x-6 md:space-y-0">
                {menus.map((item, idx) => (
                  <li key={idx} className="text-gray-600">
                    <a href={item.anchor} className="hover:text-gray-800">
                      {item.title}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/pages/protected/auth/login"
                    className="inline-block px-4 py-2 text-white rounded-md"
                    style={{
                      backgroundColor: "#F56E13", // Cambiar color del botón
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
