import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Your Health at a Glance</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Track improvements, upcoming appointments, and personalized tips.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Next appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">Fri, Sep 5 — 10:15 AM</p>
            <p className="text-muted-foreground">Video with Dr. Maya Chen</p>
            <Button size="sm" className="mt-3 bg-blue-600 text-white hover:bg-blue-700">
              View details
            </Button>
          </CardContent>
        </Card>

        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Today’s checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-md border p-2">
              <span>Take blood pressure reading</span>
              <Button variant="outline" size="sm" className="hover:bg-slate-50 bg-transparent">
                Mark done
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-2">
              <span>Log symptoms</span>
              <Button variant="outline" size="sm" className="hover:bg-slate-50 bg-transparent">
                Open
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border p-2">
              <span>Hydration goal</span>
              <Button variant="outline" size="sm" className="hover:bg-slate-50 bg-transparent">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Wellness insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-slate-700">Consistent sleep and light activity are linked to fewer headaches.</p>
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
              See more
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}