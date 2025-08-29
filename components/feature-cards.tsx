import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, MapPin, CalendarDays, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Stethoscope,
    title: "AI Symptom Checker",
    desc: "Natural language triage with urgency labels for fast decisions.",
  },
  {
    icon: MapPin,
    title: "Nearest Match",
    desc: "Find the right specialist and closest hospital with geolocation.",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    desc: "Real-time slot booking with instant confirmations and reminders.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Records",
    desc: "Encrypted storage with simple sharing for doctors and clinics.",
  },
] as const

export function FeatureCards() {
  return (
    <section aria-labelledby="features-title">
      <h2 id="features-title" className="mb-4 text-2xl font-semibold">
        Everything you need
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Card
            key={i}
            className="border-0 ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                <f.icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}