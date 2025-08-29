"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"

const slots = ["09:30", "10:00", "11:15", "14:00", "16:15", "17:45"]

export function AppointmentSchedulerPreview() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <Card id="appointments" className="border-0 ring-1 ring-black/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <CalendarDays className="size-4" aria-hidden />
          </span>
          Smart Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Date</span>
            <Input type="date" aria-label="Select date" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Doctor</span>
            <Input placeholder="e.g. Dr. Lin" aria-label="Doctor name" />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {slots.map((s) => {
            const isActive = selected === s
            return (
              <Button
                key={s}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={cn("justify-center", isActive ? "" : "bg-transparent")}
                aria-pressed={isActive}
                onClick={() => setSelected(s)}
              >
                <Clock className="mr-2 size-4" aria-hidden />
                {s}
              </Button>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Button className="min-w-40">Confirm</Button>
          <Button variant="secondary" className="min-w-40">
            Add Reminder
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}