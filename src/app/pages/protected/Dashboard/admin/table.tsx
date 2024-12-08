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

interface User{ 
    email: string
    lastName: string
    name: string
    phone_number: string
    state: boolean
}

interface Profesional{
    id:string
    User: User
    state: boolean
    specialty: string
    registration_date: Date
}

interface Patient{
    id: string
    name: string
    lastName: string
    email: string
    state: string
    phone_number:string
    registration_date: Date
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
                        Borrar
                    </button>
                </div>
            </div>
        </div>
    );
};

const TurnoTable = ({ refreshKey }: { refreshKey: number }) => {
    const [profesionales, setProfesionales] = useState<Profesional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchProfesionales = async () => {
            try {
                const response = await fetch("/api/AdminApi/getProfessionals");

                console.log(response)
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al cargar los datos");
                }
                const data = await response.json();
                console.log("Datos de profesionales:", data); // Debugging
                setProfesionales(Array.isArray(data) ? data : []); // Asegurar que sea un arreglo
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchProfesionales();
    }, [refreshKey]);

    const paginatedData = Array.isArray(profesionales)
        ? profesionales.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
        : [];

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Especialidad</TableHead>
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
                            <TableCell>{profesional.User.phone_number}</TableCell>
                            <TableCell>{profesional.state ? "Activo" : "Inactivo"}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => {
                                        setSelectedProfessionalId(profesional.id);
                                        setModalOpen(true);
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Borrar
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Anterior
                </button>
                <span className="mx-2">{currentPage}</span>
                <button
                    disabled={currentPage * itemsPerPage >= profesionales.length}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Siguiente
                </button>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={() => {}} />
        </div>
    );
};

export default TurnoTable;

