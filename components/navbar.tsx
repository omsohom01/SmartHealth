"use client"

import { Button } from "@/components/ui/button"
import { Stethoscope, CalendarDays, FileText, ClipboardCheck, BotMessageSquare } from "lucide-react"
import { LanguageToggle } from "./language-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const links = [
    { href: "/chat", label: "Symptoms", Icon: BotMessageSquare },
    { href: "/doctors", label: "Match", Icon: ClipboardCheck },
    { href: "/appointments", label: "Appointments", Icon: CalendarDays },
    { href: "/records", label: "Records", Icon: FileText },
    { href: "/dashboard", label: "Dashboard", Icon: Stethoscope },
  ]

  return (
    <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/0 shadow-sm ring-1 ring-white/10">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
            <Stethoscope className="size-5" aria-hidden />
          </div>
          <span className="text-base font-semibold tracking-tight">CareLink</span>
        </div>

        <ul className="hidden items-center gap-3 md:flex">
          {links.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-white/60 ${active ? "bg-white/15 text-white" : "opacity-90 hover:opacity-100 hover:bg-white/10"}`}
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="underline-offset-4">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button asChild size="sm" variant="secondary" className="text-slate-900">
            <Link href="/appointments">Book Now</Link>
          </Button>
        </div>
      </nav>
    </div>
  )
}