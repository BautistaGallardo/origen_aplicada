'use client';

const Profesionales = () => {
  return (
    <div
      id="professionals" // Agregamos el identificador para enlazar desde el menú
      className="bg-white text-black w-full mx-auto my-12 p-8 text-center"
    >
      <h2 className="text-3xl font-bold mb-4">Nuestros Profesionales</h2>
      <p className="text-lg mb-2">
        Estamos capacitados para ofrecerte la atención médica que te mereces.
      </p>
      <p className="text-lg mb-2">
        Tu salud, tu seguridad y bienestar… son nuestra máxima prioridad.
      </p>
      <p className="text-lg">
        Es por eso que contamos con los profesionales más capacitados.
      </p>
    </div>
  );
};

export default Profesionales;
