"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, LocateFixed, Navigation } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export function DoctorMatchCard() {
  return (
    <Card id="match" className="border-0 ring-1 ring-black/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <MapPin className="size-4" aria-hidden />
          </span>
          Auto-Match Doctor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex gap-2">
            <Input placeholder="Enter your location" aria-label="Location" />
            <Button variant="secondary" aria-label="Use my location">
              <LocateFixed className="mr-2 size-4" aria-hidden />
              Use
            </Button>
          </div>
          <Select>
            <SelectTrigger aria-label="Select specialty">
              <SelectValue placeholder="Choose specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doctor preview */}
        <div className="grid items-center gap-3 sm:grid-cols-[auto,1fr]">
          <Image
            src="/doctor-avatar-headshot.png"
            alt="Recommended doctor headshot"
            width={56}
            height={56}
            className="rounded-md ring-1 ring-black/10"
          />
          <div className="space-y-1">
            <p className="text-sm">
              Recommended: <span className="font-medium">Dr. Lin (Cardiologist)</span> — 1.2 km away
            </p>
            <p className="text-xs text-muted-foreground">Availability: Today 4:15 PM, 5:00 PM</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm">Book 4:15 PM</Button>
              <Button size="sm" variant="outline">
                Directions <Navigation className="ml-1 size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </div>

        {/* Mini map */}
        <div className="overflow-hidden rounded-md ring-1 ring-black/10">
          <Image
            src="/mini-map-view-to-clinic.png"
            alt="Mini map preview to the clinic"
            width={640}
            height={200}
            className="h-40 w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  )
}