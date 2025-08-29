import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Health Assistant</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Describe symptoms in plain language. Our assistant helps triage urgency and prepare for your visit.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Start a conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="message" className="sr-only">
                Your message
              </label>
              <textarea
                id="message"
                placeholder="e.g., I have a throbbing headache and mild fever since yesterday..."
                className="w-full min-h-[140px] rounded-md border bg-background p-3 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                Suggest prompts
              </Button>
            </div>
            <div aria-live="polite" className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              Tip: Include duration, pain level, and any allergies for faster, safer guidance.
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Recent conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Headache + light sensitivity", time: "2 days ago" },
              { title: "Sore throat + cough", time: "5 days ago" },
              { title: "Back pain after lifting", time: "1 week ago" },
            ].map((c) => (
              <div key={c.title} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-muted-foreground text-sm">{c.time}</p>
                </div>
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                  Open
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}