"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Activity, Zap, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const displayName = user?.name ? user.name.trim().split(/\s+/)[0] : null

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={cn(
        "w-full z-50 transition-all duration-700 ease-out",
        isSticky ? "fixed top-0 glass-effect shadow-2xl border-b border-gray-800/50" : "absolute top-0 bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4 lg:px-6">
        {/* Enhanced Professional Logo */}
        <Link href="/" className="group relative flex items-center transition-all duration-500">
          <div className="flex items-center space-x-3">
            {/* Logo Icon with sophisticated design */}
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-100 to-white rounded-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-500 animate-logo-pulse border border-gray-200/20">
                <div className="relative">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                  <Zap className="absolute -top-1 -right-1 w-3 h-3 text-gray-700 animate-scale-pulse" />
                </div>
              </div>
              {/* Floating particles around logo */}
              <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full animate-float"></div>
                <div
                  className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-float"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full animate-float"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full animate-float"
                  style={{ animationDelay: "3s" }}
                ></div>
              </div>
            </div>

            {/* Logo Text with enhanced typography */}
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold tracking-[0.15em] text-white group-hover:text-gray-200 transition-colors duration-300">
                SYNAPTIX
              </span>
              <span className="text-xs text-gray-500 tracking-[0.3em] font-light -mt-1">HEALTHCARE</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link
            href="/"
            className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
          >
            HOME
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            <div className="absolute -inset-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          <Link
            href="/synaptix-ai"
            className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
          >
            SYNAPTIX AI
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            <div className="absolute -inset-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          <Link
            href="/synaptix-vision"
            className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
          >
            SYNAPTIX VISION
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            <div className="absolute -inset-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          <Link
            href="/synaptix-haven"
            className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
          >
            SYNAPTIX HAVEN
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
            <div className="absolute -inset-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          <div className="flex items-center space-x-4 lg:space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'patient' && (
                  <>
                    <Link
                      href="/appointments/book"
                      className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
                    >
                      BOOK APPOINTMENT
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      href="/dashboard/patient"
                      className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
                    >
                      PATIENT DASHBOARD
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                {user?.role === 'doctor' && (
                  <Link
                    href="/dashboard/doctor"
                    className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group"
                  >
                    DOCTOR DASHBOARD
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium tracking-wider group flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  {displayName || 'Profile'}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="relative text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm font-medium tracking-wider px-4 py-2 rounded-lg magnetic-hover overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    LOGOUT
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="relative text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm font-medium tracking-wider px-4 py-2 rounded-lg magnetic-hover overflow-hidden group"
                  >
                    <span className="relative z-10">LOGIN</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>

                <Link href="/auth/signup">
                  <Button className="relative overflow-hidden bg-white text-black hover:bg-gray-100 text-sm font-medium px-6 lg:px-8 py-2.5 rounded-xl transition-all duration-500 tracking-wider group shadow-lg hover:shadow-xl hover:scale-105">
                    <span className="relative z-10 flex items-center">
                      SIGN UP
                      <div className="ml-2 relative">
                        <div className="w-1 h-1 bg-black rounded-full group-hover:scale-150 group-hover:translate-x-1 transition-all duration-300"></div>
                        <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-black rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"></div>
                        <div className="absolute inset-0 w-1 h-1 bg-black/20 rounded-full scale-0 group-hover:scale-200 transition-all duration-300"></div>
                      </div>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 magnetic-hover rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <Menu
              className={cn(
                "absolute inset-0 w-5 h-5 transition-all duration-300",
                isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
              )}
            />
            <X
              className={cn(
                "absolute inset-0 w-5 h-5 transition-all duration-300",
                isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
              )}
            />
          </div>
        </Button>
      </div>

      {/* Enhanced Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 w-full glass-effect border-b border-gray-800/50 transition-all duration-500 ease-out",
          isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible",
        )}
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          <Link
            href="/"
            className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            href="/synaptix-ai"
            className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            SYNAPTIX AI
          </Link>
          <Link
            href="/synaptix-vision"
            className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            SYNAPTIX VISION
          </Link>
          <div className="space-y-3 pt-4 border-t border-gray-800/30">
            {isAuthenticated ? (
              <>
                {user?.role === 'patient' && (
                  <>
                    <Link
                      href="/appointments/book"
                      className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      BOOK APPOINTMENT
                    </Link>
                    <Link
                      href="/dashboard/patient"
                      className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      PATIENT DASHBOARD
                    </Link>
                  </>
                )}
                {user?.role === 'doctor' && (
                  <Link
                    href="/dashboard/doctor"
                    className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    DOCTOR DASHBOARD
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block text-gray-400 hover:text-white transition-colors text-base font-medium tracking-wider py-3 px-4 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {displayName || 'PROFILE'}
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-gray-400 hover:text-white hover:bg-white/5 text-base font-medium justify-start px-4 tracking-wider rounded-lg"
                >
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-white/5 text-base font-medium justify-start px-4 tracking-wider rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-100 text-base font-medium tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center">
                      SIGN UP
                      <div className="ml-2 relative">
                        <div className="w-1 h-1 bg-black rounded-full group-hover:scale-150 group-hover:translate-x-1 transition-all duration-300"></div>
                        <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-black rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"></div>
                      </div>
                    </span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
