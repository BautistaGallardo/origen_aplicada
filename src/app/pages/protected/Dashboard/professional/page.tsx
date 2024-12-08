"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import WorkScheduleModal from "./laboral"; // Ajusta la ruta según la ubicación del archivo
import TurnoTable from "./table"; // Ajusta la ruta si es necesario

const DashboardProfessional = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [view, setView] = useState<"default" | "historial">("default");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Callbacks
  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
  const handleTurnoCreated = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen flex bg-custom-lightGray text-custom-blueGray">
      {/* Sidebar */}
      <aside className="bg-white shadow-lg w-64 fixed h-full flex flex-col justify-between">
        <div className="p-6 border-b border-custom-blueGray">
          {isAuthenticated && (
            <div className="space-y-4">
              {/* Saludo */}
              <div className="flex items-center space-x-4">
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <h1 className="text-2xl font-bold text-custom-blueGray">
                  Hola, {session?.user?.name || "Usuario"}
                </h1>
              </div>
              {/* Botones de navegación */}
              <nav className="space-y-4">
                <ul className="space-y-4">
                  <li>
                    <WorkScheduleModal />
                  </li>
                  <li>
                    <button
                      onClick={() => setView("historial")}
                      className="w-full text-left px-4 py-2 bg-custom-orange text-white rounded-md hover:bg-opacity-80"
                    >
                      Historial de Pacientes
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setView("default")}
                      className="w-full text-left px-4 py-2 bg-custom-lightGray text-custom-blueGray rounded-md hover:bg-opacity-80"
                    >
                      Volver al Dashboard
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
        {/* Botones Cambiar Contraseña y Cerrar Sesión */}
        <div className="p-6">
          <button
            onClick={openChangePasswordModal}
            className="w-full px-4 py-2 mb-4 text-white bg-custom-blueGray rounded-md hover:bg-opacity-80"
          >
            Cambiar Contraseña
          </button>
          <button
            onClick={openLogoutModal}
            className="w-full px-4 py-2 text-white bg-custom-orange rounded-md hover:bg-opacity-80"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-6 space-y-4">
        {view === "default" && (
          <div>
            <h2 className="text-2xl font-bold text-custom-blueGray">
              Bienvenido al Portal del Profesional
            </h2>
            <p className="text-custom-blueGray">
              Selecciona una opción del menú lateral.
            </p>
          </div>
        )}
        {view === "historial" && (
          <div className="space-y-4 h-full">
            <TurnoTable refreshKey={refreshKey} onTurnoCreated={handleTurnoCreated} />
          </div>
        )}
      </main>

      {/* Modal de Cambiar Contraseña */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ingrese su contraseña actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ingrese nueva contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirme nueva contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </form>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={closeChangePasswordModal}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Implementar lógica de cambio de contraseña aquí
                  closeChangePasswordModal();
                }}
                className="px-4 py-2 bg-custom-blueGray text-white rounded-md hover:bg-opacity-80"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Cerrar Sesión */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">¿Estás seguro de cerrar sesión?</h2>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-custom-blueGray text-white rounded-md hover:bg-opacity-80"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProfessional;
