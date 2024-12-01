import React, { useEffect, useState } from "react";

type Turno = {
  id: string;
  date: string;
  hour: string;
  state: string;
  Professional: {
    User: {
      name: string;
      email: string;
    };
  };
  Patient: {
    User: {
      name: string;
    };
  };
};

const TurnosTable = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch("/api/turnos");
        const data = await response.json();

        if (Array.isArray(data)) {
          setTurnos(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
        }
      } catch (error) {
        console.error("Error al cargar los turnos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  if (loading) {
    return <div className="p-4">Cargando turnos...</div>;
  }

  if (!turnos || turnos.length === 0) {
    return <div className="p-4">No hay turnos disponibles.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Historial de Turnos</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Profesional</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Paciente</th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Hora</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">
                {turno.Professional.User.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {turno.Professional.User.email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {turno.Patient.User.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(turno.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{turno.hour}</td>
              <td className="border border-gray-300 px-4 py-2">{turno.state}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="mr-2 text-gray-600 hover:underline">
                  Editar
                </button>
                <button className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TurnosTable;
