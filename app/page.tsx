import { FeatureCards } from "@/components/feature-cards"
import { Chatbot } from "@/components/chatbot"
import { AppointmentSchedulerPreview } from "@/components/appointment-scheduler-preview"
import { DoctorMatchCard } from "@/components/doctor-match-card"
import { RecordsCard } from "@/components/records-card"
import { DashboardWidgets } from "@/components/dashboard-widgets"
import { Button } from "@/components/ui/button"
import { Stethoscope } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
      {/* Hero + Chatbot */}
      <section id="symptoms" className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-foreground ring-1 ring-accent/20 w-max">
            <Stethoscope className="size-4 text-accent" aria-hidden />
            <span className="font-medium">AI symptom checker</span>
          </div>
          <h1 className="text-balance text-4xl font-semibold md:text-5xl">Smarter care starts here</h1>
          <p className="text-pretty text-muted-foreground">
            Describe your symptoms in natural language. We’ll guide you with urgency levels, match you to the right
            specialist, and help you book instantly.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="min-w-40" size="lg" asChild>
              <Link href="/chat">Check Symptoms</Link>
            </Button>
            <Button className="min-w-40" size="lg" variant="secondary" asChild>
              <Link href="/appointments">Book Appointment</Link>
            </Button>
          </div>

          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
            <li>• Multilingual, accessible design</li>
            <li>• Secure records with easy sharing</li>
            <li>• Real-time slots and reminders</li>
          </ul>
        </div>

        <Chatbot />
      </section>

      {/* Feature Grid */}
      <FeatureCards />

      {/* Doctor match + Scheduler */}
      <section id="match" className="grid gap-6 md:grid-cols-2">
        <DoctorMatchCard />
        <div id="appointments">
          <AppointmentSchedulerPreview />
        </div>
      </section>

      {/* Dashboard + Records */}
      <section id="records" className="grid gap-6 md:grid-cols-2">
        <DashboardWidgets />
        <RecordsCard />
      </section>
    </div>
  )
}