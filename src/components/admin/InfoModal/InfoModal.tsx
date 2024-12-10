import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface ModalInfoProps {
    isOpen: boolean;
    onClose: () => void;
    professionalId: string | null;  // Debe coincidir con la propiedad que pasas desde TurnoTable
    appointments: any[]; // O ajusta según el tipo de los turnos
}

const ModalInfo: React.FC<ModalInfoProps> = ({ isOpen, onClose, professionalId, appointments }) => {
    // Estado para controlar el tipo de filtro seleccionado
    const [filterState, setFilterState] = useState<string>("realizado");

    // Filtrar los turnos según el estado seleccionado
    const filteredAppointments = appointments.filter(
        (appointment) => appointment.state === filterState
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl min-h-96">
                <DialogHeader>
                    <DialogTitle>Turnos del Profesional(Últimos 30 días)</DialogTitle>
                </DialogHeader>

                {/* Select para elegir el filtro */}
                <div className="mt-4">
                    <label htmlFor="appointment-filter" className="mr-2">
                        Filtrar por Estado:
                    </label>
                    <select
                        id="appointment-filter"
                        className="px-4 py-2 text-custom-orange border border-custom-orange rounded-md cursor-pointer"
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                    >
                        <option value="realizado">Realizados</option>
                        <option value="cancelado">Cancelados</option>
                        <option value="pendiente">Pendientes</option>
                    </select>
                </div>

                <div className="overflow-auto max-h-96 mt-4">
                    {filteredAppointments.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-custom-orange text-white">
                                    <th className="border border-gray-300 px-4 py-2">Fecha</th>
                                    <th className="border border-gray-300 px-4 py-2">Paciente</th>
                                    <th className="border border-gray-300 px-4 py-2">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(appointment.date).toLocaleDateString("es-ES", {timeZone: "UTC",})} hora: {appointment.hour}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {appointment.Reservations?.[0]?.Patient?.User?.name || "Sin nombre"} {appointment.Reservations?.[0]?.Patient?.User?.lastName || "Sin nombre"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {appointment.state}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No se encontraron turnos en el estado seleccionado.</p>
                    )}
                </div>

                <DialogFooter>
                    <button
                        onClick={onClose}
                        className="  px-4 py-2 max-h-11 text-custom-orange border border-custom-orange rounded-md hover:bg-custom-orange hover:text-white transition duration-300"
                    >
                        Cerrar
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalInfo;
