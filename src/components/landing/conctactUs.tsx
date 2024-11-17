'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const Contact = () => {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md space-y-8 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Contactanos</h1>
          <p className="text-white-300">
            Todos los mensajes importan, esperamos el de usted.
          </p>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-white">Nombre</Label>
              <Input id="first-name" placeholder="Ingresa tu nombre" className="bg-black text-white border border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-white">Apellido</Label>
              <Input id="last-name" placeholder="Ingresa tu apellido" className="bg-black text-white border border-gray-600" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" placeholder="Ingresa tu correo" className="bg-black text-white border border-gray-600" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Mensaje</Label>
            <Textarea id="message" placeholder="Ingresa tu mensaje" className="min-h-[120px] bg-black text-white border border-gray-600" />
          </div>
          <Button type="submit" className="bg-white text-black hover:bg-gray-300">
            Enviar
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Contact;