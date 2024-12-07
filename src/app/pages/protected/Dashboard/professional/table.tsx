import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Turnos {
  date: string; // Fecha del turno
  hour: string; // Hora del turno
  state: string; // Estado del turno
  patientPhone: string;
  patientName: string; // Nombre completo del paciente
}

const TurnoTable = () => {
  const [turnos, setTurnos] = useState<Turnos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTurno, setSelectedTurno] = useState<Turnos | null>(null);
  const [modalType, setModalType] = useState<"confirm" | "cancel" | null>(null);
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPage = 10;

  const totalPages = Math.ceil (turnos.length / itemsPage);

  useEffect(() => {
    const fetchTurnos = async () => {
      if (!session?.user?.email) {
        setError("No se encontró el email del usuario.");
        setLoading(false);
        return;
      }

      try {
        const email = session.user.email;

        const response = await fetch(
          `http://localhost:3000/api/getAllAppointments?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al cargar los datos");
        }

        const data = await response.json();
        setTurnos(data);
        setError(null);
      } catch (err: any) {
        console.error("Error al cargar turnos:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [session?.user?.email]);

  const handleModalOpen = (turno: Turnos, type: "confirm" | "cancel") => {
    setSelectedTurno(turno);
    setModalType(type);
  };

  const handleModalClose = () => {
    setSelectedTurno(null);
    setModalType(null);
  };

  const handleConfirm = () => {
    console.log("Turno confirmado:", selectedTurno);
    handleModalClose();
  };

  const handleCancel = () => {
    console.log("Turno cancelado:", selectedTurno);
    handleModalClose();
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const currentData = turnos.slice((currentPage-1) * itemsPage, currentPage*itemsPage);
  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Numero de Telefono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones del Turno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((turno, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(turno.date).toLocaleDateString()}</TableCell>
              <TableCell>{turno.hour}</TableCell>
              <TableCell>{turno.patientName}</TableCell>
              <TableCell>{turno.patientPhone}</TableCell>
              <TableCell>{turno.state}</TableCell>
              <TableCell>
                <button
                  className="px-4 py-2 text-white bg-green-500 rounded-md"
                  onClick={() => handleModalOpen(turno, "confirm")}
                >
                  Confirmar
                </button>
                <button
                  className="px-4 py-2 ml-2 text-white bg-red-500 rounded-md"
                  onClick={() => handleModalOpen(turno, "cancel")}
                >
                  Cancelar
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
          {/* Controles de Paginación */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      {modalType && selectedTurno && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">
              {modalType === "confirm"
                ? "Confirmar Turno"
                : "Cancelar Turno"}
            </h2>
            <p className="mt-2">
              {modalType === "confirm"
                ? `¿Estás seguro de que el turno con ${selectedTurno.patientName} ya fue realizado?`
                : `¿Estás seguro de que deseas cancelar el turno con ${selectedTurno.patientName}?`}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 mr-2 text-white bg-gray-500 rounded-md"
                onClick={handleModalClose}
              >
                Cerrar
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  modalType === "confirm"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
                onClick={modalType === "confirm" ? handleConfirm : handleCancel}
              >
                {modalType === "confirm" ? "Confirmar" : "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnoTable;
