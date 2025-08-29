import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Activity } from "lucide-react"
import Image from "next/image"

export function DashboardWidgets() {
  return (
    <Card className="border-0 ring-1 ring-black/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <CalendarDays className="size-4" aria-hidden />
          </span>
          Patient Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-3">
          <h3 className="text-sm font-semibold">Upcoming</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>• 2025-08-30 — Dr. Lin (Cardiologist), 4:15 PM</li>
            <li>• 2025-09-03 — Dr. Patel (Dermatology), 10:00 AM</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3">
          <h3 className="text-sm font-semibold">Recent Insights</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Consistent heart rate readings. Keep up your daily 20-minute walks.
          </p>
          <div className="mt-3 rounded-md bg-muted p-3 ring-1 ring-black/5">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="size-4" aria-hidden />
              <span className="text-sm">Weekly trend</span>
            </div>
            <Image
              src="/trend-sparkline.png"
              alt="Weekly heart rate trend sparkline chart"
              width={360}
              height={80}
              className="mt-2 rounded bg-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}