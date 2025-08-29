"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/useAuth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const hideFooter = pathname === "/synaptix-ai"

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Navbar />
        {children}
        {!hideFooter && <Footer />}
      </AuthProvider>
    </ThemeProvider>
  )
}
