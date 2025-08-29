import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const slots = [
  { time: "Today, 2:30 PM", type: "Video", available: true },
  { time: "Today, 4:00 PM", type: "In-person", available: true },
  { time: "Tomorrow, 10:15 AM", type: "Video", available: true },
  { time: "Tomorrow, 11:45 AM", type: "In-person", available: false },
]

export default function AppointmentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Choose a time that works for you. We’ll handle reminders and pre-visit checklists.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Available slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {slots.map((s) => (
              <div
                key={s.time}
                className="flex items-center justify-between rounded-md border p-3"
                aria-disabled={!s.available}
              >
                <div>
                  <p className="font-medium">{s.time}</p>
                  <p className="text-muted-foreground text-sm">{s.type}</p>
                </div>
                {s.available ? (
                  <Button className="bg-teal-600 text-white hover:bg-teal-700">Select</Button>
                ) : (
                  <Button variant="outline" className="cursor-not-allowed opacity-60 bg-transparent">
                    Full
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Pre-visit checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Confirm insurance</span>
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                Update
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Recent medications</span>
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                Add
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span>Allergies & sensitivities</span>
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}