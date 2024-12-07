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

type ID = {
    patient_id: string;
    appointment_id: string;
};

interface Reservacion {
    patient_id: string;
    appointment_id: string;
    state: string;
    Appointment: {
        hour: string;
        date: string;
        Professional: {
            specialty: string;
            User: {
                name: string;
                lastName: string;
            };
        };
    };
}

const Modal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold">¿Está seguro?</h2>
                <p className="mt-4">¿Desea cancelar este turno?</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

const TurnoTable = ({ refreshKey }: { refreshKey: number }) => {
    const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPage = 10;
    const totalPages = Math.ceil(reservaciones.length / itemsPage);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReservacionId, setSelectedReservacionId] = useState<ID | null>(null);

    const cancelarTurno = async (id: ID) => {
        try {
            // Actualiza localmente el estado a "cancelado" para la tabla del administrador
            setReservaciones((prev) =>
                prev.map((reservacion) =>
                    (reservacion.appointment_id === id.appointment_id && reservacion.patient_id === id.patient_id)
                        ? { ...reservacion, state: "cancelado" }
                        : reservacion
                )
            );

            // Realiza la petición al backend
            const response = await fetch(`http://localhost:3000/api/cancelReservation`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cancelar el turno");
            }

            console.log("Turno cancelado exitosamente en el backend.");
            setModalOpen(false);
        } catch (err: any) {
            console.error("Error al cancelar el turno:", err);

            // Si hay error, vuelve a marcar el turno como pendiente localmente
            setReservaciones((prev) =>
                prev.map((reservacion) =>
                    (reservacion.appointment_id === id.appointment_id && reservacion.patient_id === id.patient_id)
                        ? { ...reservacion, state: "pendiente" }
                        : reservacion
                )
            );

            setError(err.message || "Error desconocido");
        }
    };

    useEffect(() => {
        const fetchReservaciones = async () => {
            if (!session?.user?.email) {
                setError("No se encontró el email del usuario.");
                setLoading(false);
                return;
            }

            try {
                const email = session.user.email;

                const response = await fetch(
                    `http://localhost:3000/api/getAllReservations?email=${email}`,
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
                console.log(data);
                setReservaciones(data);
                setError(null);
            } catch (err: any) {
                console.error("Error al cargar reservaciones:", err);
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchReservaciones();
    }, [session?.user?.email, refreshKey]); // Aquí el refreshKey forza la recarga

    if (loading) {
        return <div className="text-center">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }
    const turnoPendiente = reservaciones.some((reservacion) => reservacion.state === "pendiente");
    const currentData = reservaciones.slice ((currentPage-1) * itemsPage, currentPage * itemsPage);
    return (
        <>
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Profesional</TableHead>
                        <TableHead>Especialidad</TableHead>
                        <TableHead>Estado</TableHead>
                        {turnoPendiente && <TableHead>Cancelar Turno</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentData.length > 0 ? (
                        currentData.map((reservacion) => (
                            <TableRow key={reservacion.appointment_id}>
                                <TableCell>{new Date(reservacion.Appointment.date).toLocaleDateString()}</TableCell>
                                <TableCell>{reservacion.Appointment.hour}</TableCell>
                                <TableCell>{`${reservacion.Appointment.Professional.User.name} ${reservacion.Appointment.Professional.User.lastName}`}</TableCell>
                                <TableCell>{reservacion.Appointment.Professional.specialty}</TableCell>
                                <TableCell>{reservacion.state}</TableCell>
                                <TableCell>
                                    {reservacion.state === "pendiente" ? (
                                        <button
                                            onClick={() => {
                                                setSelectedReservacionId({ patient_id: reservacion.patient_id, appointment_id: reservacion.appointment_id });
                                                setModalOpen(true);
                                            }}
                                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                        >
                                            Cancelar
                                        </button>
                                    ) : (
                                        <span className="text-gray-400">No disponible</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No hay reservaciones disponibles
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
                     {/* Controles de paginación */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-300 rounded ml-2"
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => {
                    if (selectedReservacionId) {
                        cancelarTurno(selectedReservacionId);
                    }
                }}
            />
        </>
    );
};

export default TurnoTable;
