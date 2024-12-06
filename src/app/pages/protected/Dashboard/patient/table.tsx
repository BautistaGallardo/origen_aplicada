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

interface Reservacion {
    id: string;
    state:string
    Appointment: {
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

const TurnoTable = () => {
    const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchReservaciones = async () => {
            if (!session?.user?.email) {
                setError("No se encontró el email del usuario.");
                setLoading(false);
                return;
            }
            
            try {
                const email = session.user.email;
                console.log(email)

                const response = await fetch(`http://localhost:3000/api/getAllReservations?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                  }); 
                console.log("Respuesta de la API:", response);

                // Si la respuesta no es exitosa, lanza un error con el mensaje adecuado
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al cargar los datos");
                }

                const data = await response.json();
                console.log(data)
                console.log("Datos recibidos de la API:", data);

                setReservaciones(data);
                setError(null); // Limpiamos el error si la solicitud tiene éxito
            } catch (err: any) {
                console.error("Error al cargar reservaciones:", err);
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchReservaciones();
    }, [session?.user?.email]);

    if (loading) {
        return <div className="text-center">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reservaciones.length > 0 ? (
                    reservaciones.map((reservacion) => (
                        <TableRow key={reservacion.id}>
                            <TableCell>{reservacion.Appointment.date}</TableCell>
                            <TableCell>{`${reservacion.Appointment.Professional.User.name} ${reservacion.Appointment.Professional.User.lastName}`}</TableCell>
                            <TableCell>{reservacion.Appointment.Professional.specialty}</TableCell>
                            <TableCell>{reservacion.state}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">
                            No hay reservaciones disponibles
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default TurnoTable;