import React, {useState, useEffect} from "react";
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

} 


  
  const TurnoTable = () => {
    const [turnos, setTurnos] = useState<Turnos[]>([]);
    const [loading, setLoading] = useState (true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

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
                console.log(data);
                setTurnos(data);
                setError(null);
            } catch (err: any) {
                console.error("Error al cargar reservaciones:", err);
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchTurnos();
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
                      <TableHead>Paciente</TableHead>
                      <TableHead>Numero de Telefono</TableHead>
                      <TableHead>Atención</TableHead>
                      <TableHead>Acciones</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                
              </TableBody>
          </Table>
      );
  };
  
  export default TurnoTable;
  