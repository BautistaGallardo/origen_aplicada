'use client'
import { Button } from "@/components/ui/button"

const Introduccion = () => {
  return (
    <div className="bg-white text-black min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-wider">
          En manos de PROFESIONALES
        </h1>
        <p className="text-lg">
          Somos Gisela y Luis, directores de Origen, centro de especialidades médicas, apostamos a un lugar que acompañe desde el compromiso y la responsabilidad.
        </p>
        <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md">
          Pedir turno
        </Button>
      </div>
    </div>
  )
}

export default Introduccion;