import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const doctors = [
  {
    name: "Dr. Maya Chen",
    specialty: "Family Medicine",
    rating: 4.9,
    distance: "1.2 mi",
    img: "/doctor-portrait.png",
  },
  {
    name: "Dr. Arjun Patel",
    specialty: "Pediatrics",
    rating: 4.8,
    distance: "2.1 mi",
    img: "/pediatrician-portrait.png",
  },
  {
    name: "Dr. Elena Garcia",
    specialty: "Cardiology",
    rating: 4.7,
    distance: "3.4 mi",
    img: "/cardiologist-portrait.png",
  },
]

export default function DoctorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Find a Doctor</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Matched to your symptoms, insurance, and location. Book with confidence.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {doctors.map((d) => (
          <Card key={d.name} className="overflow-hidden border bg-white/95">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">{d.name}</CardTitle>
              <p className="text-muted-foreground">{d.specialty}</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4 flex items-center gap-4">
                <Image
                  src={d.img || "/placeholder.svg"}
                  alt={`Headshot of ${d.name}`}
                  width={80}
                  height={80}
                  className="rounded-full border"
                />
                <div className="text-sm">
                  <p>
                    <span className="font-medium">{d.rating}</span> / 5.0 rating
                  </p>
                  <p className="text-muted-foreground">{d.distance} from you</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">View profile</Button>
                <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50 bg-transparent">
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}