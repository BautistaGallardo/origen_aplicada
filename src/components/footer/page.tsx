import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white-100">
      <div className="container px-4 py-8 mx-auto flex flex-col md:flex-row md:justify-between">
        <div className="w-64 mb-4 md:mb-0">
          <Link href={"/"} className="text-3xl font-bold text-black-600">
            ORIGEN
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            Centro de especialidades médicas, trabajando día a día en equipo para construir un lugar mejor para ti.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:gap-12">
          <div className="mb-4 md:mb-0">
            <h2 className="mb-2 font-semibold text-gray-700">Nosotros</h2>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><Link href={"/sobre-nosotros"}>Sobre Nosotros</Link></li>
              <li><Link href={"/contacto"}>Contactanos</Link></li>
              <li><Link href={"/profesionales"}>Profesionales</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-gray-700">Seguinos</h2>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
        <p className="text-center text-sm text-gray-500">
          Copyright © 2024 BRIX Templates | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}