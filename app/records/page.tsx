import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const records = [
  { title: "Lab Results - CBC", date: "Aug 14, 2025", summary: "All values within normal range." },
  { title: "X-Ray - Lumbar Spine", date: "Jul 03, 2025", summary: "Mild strain, no fracture noted." },
  { title: "Prescription - Amoxicillin", date: "May 21, 2025", summary: "10-day course, completed." },
]

export default function RecordsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Health Records</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Secure access to your labs, imaging, prescriptions, and visit notes.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Your files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {records.map((r) => (
              <div key={r.title} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.title}</p>
                  <span className="text-muted-foreground text-sm">{r.date}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{r.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                    View
                  </Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">Download</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Share access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              Generate secure, time-limited links to share specific records with specialists or caregivers.
            </p>
            <div className="flex items-center gap-3">
              <Button className="bg-teal-600 text-white hover:bg-teal-700">Create share link</Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}