"use client"
import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useSession } from 'next-auth/react';


export default function Navbar() {
  const [state, setState] = React.useState(false)

  const menus = [
    { title: "Inicio", path: "/" },
    { title: "Sobre Nosotros", path: "/" },
    { title: "Profesionales", path: "/" },
    { title: "Contactanos", path: "/" },
  ]

  return (
    <nav className="bg-white w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold text-black-600">ORIGEN</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-end pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col items-center space-y-8 md:flex-row md:justify-end md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li key={idx} className="text-gray-600">
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
            <li>
              <Link
                href="/pages/protected/auth/login"
                className="inline-block px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
              >
                Iniciar Sesión
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}