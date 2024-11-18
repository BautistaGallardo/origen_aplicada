import NextAuth from "next-auth"
import authConfig from "@/libs/auth.config"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt" 

const { auth: middleware } = NextAuth(authConfig)

const publicRoutes = [
  '/',
  '/pages/protected/auth/login',
  '/pages/protected/auth/register'
]

const patientRoutes = [
  '/pages/protected/dashboard/patient',
  '/pages/protected/calendar'
]

const professionalRoutes = [
  '/pages/protected/dashboard/professional'
]

const adminRoutes = [
  '/pages/protected/dashboard/admin'
]

const Select_Professional_or_Patient = [
  '/pages/protected/auth/select-professional-or-patient'
]

export default middleware(async (req) => {
  const { nextUrl } = req
  // Usamos getToken para obtener el token de la sesión
  const token = await getToken({ req, secret: process.env.AUTH_SECRET }) // Asegúrate de tener el secreto configurado
  const isLoggedIn = !!token // Verificamos si el token existe

  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: ' + token?.role)
  
  // Si no hay token y la ruta no es pública, redirigimos al login
  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/pages/protected/auth/login', nextUrl))
  }

  // Si el usuario está logueado y su rol es 'Patient', pero intenta acceder a rutas de paciente, lo redirigimos
  if (isLoggedIn && token?.role === 'Patient' && !patientRoutes.includes(nextUrl.pathname) && publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/pages/protected/dashboard/patient', nextUrl))
  }

  // Si el usuario está logueado y su rol es 'Professional', pero intenta acceder a rutas de paciente, lo redirigimos
  if (isLoggedIn && token?.role === 'Professional' && !professionalRoutes.includes(nextUrl.pathname) && publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/pages/protected/dashboard/professional', nextUrl))
  }

  // Si el usuario está logueado y su rol es 'Patient and Professional', pero no está en la página de selección
  if (isLoggedIn && token?.role === 'Patient and Professional' && !Select_Professional_or_Patient.includes(nextUrl.pathname) && publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/pages/protected/auth/select-professional-or-patient', nextUrl))
  }

  // Si el usuario es un 'Admin' y no está en las rutas de administración, lo redirigimos
  if (isLoggedIn && token?.role === 'Admin' && !adminRoutes.includes(nextUrl.pathname) && publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/pages/protected/dashboard/admin', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/pages/protected/:path*", // Middleware solo aplica a rutas protegidas
  ],
}
