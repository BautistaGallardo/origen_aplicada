'use client'
import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setStatus('Enviando...');
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('¡Mensaje enviado correctamente!');
      } else {
        setStatus('Error al enviar el mensaje.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error al enviar el mensaje.');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md space-y-8 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Contactanos</h1>
          <p className="text-white-300">
            Todos los mensajes importan, esperamos el de usted.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">Nombre</Label>
              <Input
                id="firstName"
                placeholder="Ingresa tu nombre"
                className="bg-black text-white border border-gray-600"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Apellido</Label>
              <Input
                id="lastName"
                placeholder="Ingresa tu apellido"
                className="bg-black text-white border border-gray-600"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu correo"
              className="bg-black text-white border border-gray-600"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Mensaje</Label>
            <Textarea
              id="message"
              placeholder="Ingresa tu mensaje"
              className="min-h-[120px] bg-black text-white border border-gray-600"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="bg-white text-black hover:bg-gray-300">
            Enviar
          </Button>
        </form>
        {status && <p className="text-center mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default Contact;
