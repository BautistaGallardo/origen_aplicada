'use client'
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {RutineGenerate} from "@/actions/rutine_generate"
import { useSession } from "next-auth/react";


const WorkScheduleModal = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("8");
  const [endTime, setEndTime] = useState("16");
  const [shiftTime, setShiftTime] = useState("15");
  const [startDate, setStartDate] = useState(""); // Fecha de inicio en formato string (para Input)
  const [endDate, setEndDate] = useState(""); // Fecha de fin en formato string (para Input)
  const [result, setResult] = useState(null); // Resultado de la API
  const session = useSession()
  const emailProfessional = session.data?.user.email || ""

  const days = ["L", "M", "X", "J", "V"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    try {
      const fechaInicio = new Date(startDate);
      const fechaFin = new Date(endDate);
      const intervaloMinutos = parseInt(shiftTime, 10);
      const horaInicio = parseInt(startTime, 10);
      const horaFin = parseInt(endTime, 10);
  
      // Mapear los días seleccionados (e.g., "L", "M") a valores numéricos (e.g., 1, 2)
      const diasSeleccionados = selectedDays.map((day) => {
        const dayMap: Record<string, number> = { L: 1, M: 2, X: 3, J: 4, V: 5 };
        return dayMap[day];
      });
  
      // Enviar al backend los parámetros con los días seleccionados
      const response = await RutineGenerate(
        fechaInicio,
        fechaFin,
        intervaloMinutos,
        horaInicio,
        horaFin,
        diasSeleccionados,
        emailProfessional // Pasar los días seleccionados
      );
  
      if (!response) {
        throw new Error("Error al generar intervalos");
      }

      // setResult(response); // Actualizar el estado con el resultado
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al procesar tu solicitud.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Configurar Jornada Laboral</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jornada Laboral</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p>Selecciona tus días laborales</p>
            <div className="flex space-x-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-10 h-10 rounded-full ${
                    selectedDays.includes(day)
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p>Selecciona el rango de fechas</p>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-2"
            />
          </div>
          <div>
            <p>Selecciona tu horario laboral</p>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-16"
                min="0"
                max="24"
              />
              <span>a</span>
              <Input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-16"
                min="0"
                max="24"
              />
            </div>
          </div>
          <div>
            <p>Selecciona el tiempo de turno (en minutos)</p>
            <Select value={shiftTime} onValueChange={setShiftTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Confirmar</Button>
        </DialogFooter>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Resultados Generados</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkScheduleModal;