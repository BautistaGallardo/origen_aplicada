import NextAuth from "next-auth"
import authConfig from "@/libs/auth.config"
import { NextResponse } from "next/server"
 
const { auth: middleware } = NextAuth(authConfig)

const publicRoutes = [
  '/',
  '/pages/protected/auth/login',
  '/pages/protected/auth/register'
]

const patientRoutes = [
'/pages/protected/dashboard/patient',
'/pages/protected/calendar'
// ir agregando a medida que se definan las interfaces propias del rol, lo mismo para el resto de conjutos de rutas
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

export default middleware((req) => {
  const {nextUrl, auth} = req

  const isLoggedIn = !!auth?.user
  
  // todas las rutas redirigen la mismo dashboard, no estan los front del resto
  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn){
    return NextResponse.redirect(new URL('/pages/protected/auth/login', nextUrl))
  }

  if(!patientRoutes.includes(nextUrl.pathname) && isLoggedIn && auth.user.role === 'Patient'){
    return NextResponse.redirect(new URL('/pages/protected/dashboard/patient', nextUrl))
  }

  if(!professionalRoutes.includes(nextUrl.pathname) && isLoggedIn && auth.user.role === 'Patient'){
    return NextResponse.redirect(new URL('/pages/protected/dashboard/patient', nextUrl))
  }
  // esto todavia no hace nada, no esta hecha el front
  if(!Select_Professional_or_Patient.includes(nextUrl.pathname) && isLoggedIn && auth.user.role === 'Patient and Professional'){
    return NextResponse.redirect(new URL('/pages/protected/dashboard/patient', nextUrl))
  }
  
  if(!adminRoutes.includes(nextUrl.pathname) && isLoggedIn && auth.user.role === 'Patient'){
    return NextResponse.redirect(new URL('/pages/protected/dashboard/patient', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/pages/protected/:path*", // Middleware solo aplica a rutas protegidas
  ],
};