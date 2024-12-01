"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Especialidad = {
  id: string;
  specialty: string;
  professionalName: string;
};

const TurnoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<string | undefined>();

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch("/api/especialidades");
        const data = await response.json();

        if (Array.isArray(data)) {
          setEspecialidades(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      } catch (error) {
        console.error("Error al cargar las especialidades:", error);
      }
    };

    fetchEspecialidades();
  }, []);

  const handleConfirmar = async () => {
    console.log(selectedEspecialidad); // Debugging para confirmar que se seleccionó algo
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Turno</DialogTitle>
        </DialogHeader>

        {/* Select de Especialidades */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Especialidad</label>
          <Select onValueChange={setSelectedEspecialidad}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una especialidad" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(especialidades) &&
                especialidades.map((esp) => (
                  <SelectItem key={esp.id} value={esp.id}>
                    {esp.specialty} - {esp.professionalName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TurnoModal;
