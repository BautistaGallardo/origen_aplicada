import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from '@/components/navBar/page'
import Footer from "@/components/footer/page";
import { SessionProvider } from "next-auth/react";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Clinica Origen",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav/>
        
          {children}
        
        <Footer/>
      </body>
      </SessionProvider>
    </html>
  );
}
