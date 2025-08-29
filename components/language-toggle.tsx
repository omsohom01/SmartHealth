"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useState } from "react"

export function LanguageToggle() {
  const [lang, setLang] = useState<"EN" | "ES">("EN")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Languages className="size-5" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-28">
        <DropdownMenuItem onClick={() => setLang("EN")} aria-label="Switch to English">
          EN — English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("ES")} aria-label="Switch to Spanish">
          ES — Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}