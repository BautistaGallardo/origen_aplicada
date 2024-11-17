'use client'
import { useSession } from 'next-auth/react';

const DashboardPatient= () => {
  const { data: session, update } = useSession();

  return (
    <>
    <div className="container">
      <h1 className=' text-6xl'>DashBoard Paciente</h1>
      <h2 className='text-3xl mt-12'>Session Info</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
    </>
  );
}
export default DashboardPatient;
