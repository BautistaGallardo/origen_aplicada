'use client';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div
      id="contact" // Agregamos el identificador para enlazar desde el menú
      className="bg-custom-lightGray text-white min-h-screen flex items-center justify-center"
    >
      <div className="mx-auto max-w-md space-y-8 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-custom-realBlue">Contáctanos</h1>
          <p className="text-custom-blueGray">
            Todos los mensajes importan, esperamos el de usted.
          </p>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-custom-blueGray">Nombre</Label>
              <Input id="first-name" placeholder="Ingresa tu nombre" className="bg-custom-lightGray text-custom-blueGray border border-orange-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-custom-blueGray">Apellido</Label>
              <Input id="last-name" placeholder="Ingresa tu apellido" className="bg-custom-lightGray text-custom-blueGray border border-orange-600" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-custom-blueGray">Email</Label>
            <Input id="email" type="email" placeholder="Ingresa tu correo" className="bg-custom-lightGray text-custom-blueGray border border-orange-600" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-custom-blueGray">Mensaje</Label>
            <Textarea id="message" placeholder="Ingresa tu mensaje" className="min-h-[120px] bg-custom-lightGray text-white border border-orange-600" />
          </div>
          <Button type="submit" className="bg-custom-orange text-white hover:bg-orange-300">
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
