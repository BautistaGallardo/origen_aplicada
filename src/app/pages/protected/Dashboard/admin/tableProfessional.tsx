import React, { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import ModalInfo from "@/components/admin/InfoModal/InfoModal"; // Asegúrate de que la ruta sea correcta

interface TypeIdCard {
    id_number: string;
}

interface User {
    id: string;
    email: string;
    lastName: string;
    name: string;
    phone_number: string;
    state: boolean;
    TypeIdCard: TypeIdCard;
}

interface Professional {
    id: string;
    User: User;
    state: string;
    specialty: string;
    registration_date: Date;
}

interface TurnoTableProfessionalProps {
    refreshKey: number;
    onTurnoCreated: () => void;
    stateFilter: string;
    specialtyFilter: string;  // Agregar esta línea
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}



const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold">¿Está seguro?</h2>
                <p className="mt-4">¿Desea desactivar la cuenta?</p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Procesando..." : "Borrar"}
                    </button>
                </div>
            </div>
        </div>
    );
};






  const TurnoTable: React.FC<TurnoTableProfessionalProps>  = ({
    refreshKey,
    onTurnoCreated,
    stateFilter,  // Recibe stateFilter como propiedad
}: {
    refreshKey: number;
    onTurnoCreated: () => void;
    stateFilter: string;  // Define la propiedad stateFilter
}) => {
    const [profesionales, setProfesionales] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);  // Estado para el nuevo modal
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [appointments, setAppointments] = useState([]);

    const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
    const [sstateFilter, setStateFilter] = useState<string>("");

    

    const fetchAppointments = async (id: string) => {
        try {
            const response = await fetch(`/api/AdminApi/getAppointmentByProfessional?id=${id}`);
            if (!response.ok) throw new Error("Error al obtener los turnos.");
            const data = await response.json();
            console.log(data)
            if (data.success) {
                setAppointments(data.data);
            } else {
                console.error(data.error);
                setAppointments([]);
            }
        } catch (error) {
            console.error("Error al obtener turnos:", error);
        }
    };

    const handleAction = async (id: string, action: "activate" | "deactivate") => {
        setIsLoading(true);
        try {
            // Actualiza el estado localmente para un mejor feedback visual
            setProfesionales((prev) =>
                prev.map((profesional) =>
                    profesional.id === id
                        ? { ...profesional, state: action === "activate" ? "activo" : "inactivo" }
                        : profesional
                )
            );

            const response = await fetch("http://localhost:3000/api/AdminApi/ReactivateRole", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, action, role: "professional" }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar el estado");
            }

            onTurnoCreated(); // Refresca la tabla después de la acción
            setModalOpen(false);
        } catch (err: any) {
            console.error("Error al actualizar el estado:", err);
            setError(err.message || "Error desconocido");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchProfesionales = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/AdminApi/getProfessionals");
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al cargar los datos");
                }
                const data = await response.json();
                console.log(data)

                const validData = data.map((patient: Professional) => ({
                    ...patient,
                    User: {
                        ...patient.User,
                        TypeIdCard: patient.User.TypeIdCard || { id_number: "N/A" },
                    },
                }));
                setProfesionales(validData);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchProfesionales();
    }, [refreshKey]);

    // Filtro por especialidad y estado
    const filteredProfesionales = profesionales.filter((profesional) => {
        const professionalState = profesional.state ? "Activo" : "Inactivo";
    
        const matchesSpecialty =
            specialtyFilter === "" || profesional.specialty === specialtyFilter;
        const matchesState =
            sstateFilter === "" || professionalState === sstateFilter;
    
        return matchesSpecialty && matchesState;
    });
    

    const paginatedData = filteredProfesionales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div>
            {/* Filtros */}
            <div className="mb-4 flex space-x-4">
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                    <option value="">Filtrar por Especialidad</option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Odontologia">Odontologia</option>
                </select>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={sstateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                >
                    <option value="">Filtrar por Estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Especialidad</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((profesional) => (
                        <TableRow key={profesional.id}>
                            <TableCell>{`${profesional.User.name} ${profesional.User.lastName}`}</TableCell>
                            <TableCell>{profesional.specialty}</TableCell>
                            <TableCell>{profesional.User.TypeIdCard.id_number}</TableCell>
                            <TableCell>{profesional.User.phone_number}</TableCell>
                            <TableCell>{profesional.state ? "Activo" : "Inactivo"}</TableCell>
                            <TableCell>
                                {profesional.state ? (
                                    <button
                                        onClick={() => {
                                            setSelectedProfessionalId(profesional.User.id);
                                            setModalOpen(true);
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Borrar
                                    </button>
                                ) : (
                                    <button
                                        onClick={async () =>
                                            await handleAction(profesional.User.id, "activate")
                                        }
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Reactivar
                                    </button>
                                )}
                            </TableCell>
                            <TableCell>
                                <button
                                    key={profesional.id}
                                    onClick={() => {
                                        setSelectedProfessionalId(profesional.id);
                                        fetchAppointments(profesional.id);
                                        setInfoModalOpen(true);  // Abre el modal con la información
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Ver Información
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Paginación */}
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{currentPage}</span>
                <button
                    disabled={currentPage * itemsPerPage >= profesionales.length}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {/* Modal de información */}
            <ModalInfo
                isOpen={infoModalOpen}
                onClose={() => setInfoModalOpen(false)}
                professionalId={selectedProfessionalId}  // Usamos professionalId en lugar de professional
                appointments={appointments}
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={async () => {
                  if (selectedProfessionalId) {
                    await handleAction(selectedProfessionalId, "deactivate");
                  }
                }}
                isLoading={isLoading}
            />
        </div>
    );
};

export default TurnoTable;
