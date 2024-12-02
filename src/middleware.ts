import NextAuth from "next-auth";
import authConfig from "@/libs/auth.config";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = [
  '/',
  '/pages/protected/auth/login',
  '/pages/protected/auth/register',
];

const patientRoutes = [
  '/pages/protected/dashboard/patient',
  '/pages/protected/calendar',
];

const professionalRoutes = [
  '/pages/protected/dashboard/professional',
];

const adminRoutes = [
  '/pages/protected/dashboard/admin',
];

const Select_Professional_or_Patient = [
  '/pages/protected/auth/select-professional-or-patient',
];

export default middleware(async (req) => {
  const { nextUrl } = req;

  // Obtén el token de sesión
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;

  console.log(
    "Token role:",
    token?.role || "No token"
  );

  const response = NextResponse.next();

  // Configura encabezados para evitar que el navegador almacene en cache
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  // Rutas públicas: solo para no logueados
  if (publicRoutes.includes(nextUrl.pathname)) {
    if (isLoggedIn) {
      // Redirigir logueados al dashboard según su rol
      switch (token.role) {
        case "Patient":
          return NextResponse.redirect(
            new URL("/pages/protected/dashboard/patient", nextUrl)
          );
        case "Professional":
          return NextResponse.redirect(
            new URL("/pages/protected/dashboard/professional", nextUrl)
          );
        case "Admin":
          return NextResponse.redirect(
            new URL("/pages/protected/dashboard/admin", nextUrl)
          );
        case "Patient and Professional":
          return NextResponse.redirect(
            new URL(
              "/pages/protected/auth/select-professional-or-patient",
              nextUrl
            )
          );
        default:
          break;
      }
    }
    return response;
  }

  // Verifica acceso a rutas específicas según el rol
  if (isLoggedIn) {
    if (token.role === "Patient" && !patientRoutes.includes(nextUrl.pathname)) {
      return NextResponse.redirect(
        new URL("/pages/protected/dashboard/patient", nextUrl)
      );
    }
    if (
      token.role === "Professional" &&
      !professionalRoutes.includes(nextUrl.pathname)
    ) {
      return NextResponse.redirect(
        new URL("/pages/protected/dashboard/professional", nextUrl)
      );
    }
    if (
      token.role === "Admin" &&
      !adminRoutes.includes(nextUrl.pathname)
    ) {
      return NextResponse.redirect(
        new URL("/pages/protected/dashboard/admin", nextUrl)
      );
    }
    if (
      token.role === "Patient and Professional" &&
      !Select_Professional_or_Patient.includes(nextUrl.pathname)
    ) {
      return NextResponse.redirect(
        new URL(
          "/pages/protected/auth/select-professional-or-patient",
          nextUrl
        )
      );
    }
  }

  // Si no hay sesión y la ruta no es pública, redirige al login
  if (!isLoggedIn) {
    return NextResponse.redirect(
      new URL("/pages/protected/auth/login", nextUrl)
    );
  }

  // Si pasa todas las verificaciones, continúa
  return response;
});

export const config = {
  matcher: [
    "/pages/protected/:path*", 
  ],
};
