'use client'
import './globals.css';
import Sidebar from '@/components/layout/sidebar';
import { Geist, Geist_Mono } from "next/font/google";
import * as React from 'react';
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { usePathname } from 'next/navigation'

const AuthProvider = dynamic(
  () => import('@/context/AuthContext').then(mod => mod.AuthProvider),
  { ssr: false },
) // Add dynamic import for AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() // Add pathname hook

  useEffect(() => {
    if (pathname === '/') {
      // Check if the current path is the root
      const searchParams = window.location.search; // Get any search parameters
      // window.location.href = '/enrichment' // Redirect to /enrichment
      window.location.href = `/home${searchParams}`;
      // Redirect to /email-finder
    }
  }, [pathname])
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastContainer></ToastContainer>

        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 md:ml-0 ml-14">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}