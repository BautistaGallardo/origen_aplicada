'use client'
const AboutUs = () => {
    return (
    <div className="bg-black text-white w-full mx-auto my-6 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Sobre Nosotros</h2>
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8">
          <p className="md:w-1/2">
            Origen es un centro de especialidades médicas que cuenta con un grupo de profesionales de diferentes especialidades que trabajan de manera independiente en un mismo centro.
          </p>
          <p className="md:w-1/2">
            Nos encontramos en:<br />
            25 de mayo 38 / Local 2 / Villa Libertador – Entre Ríos
          </p>
        </div>
      </div>
    )
  }

  export default AboutUs;