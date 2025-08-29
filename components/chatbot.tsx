"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UrgencyBadge } from "./urgency-badge"
import { Bot, SendHorizonal } from "lucide-react"
import { useState } from "react"

type Message = { role: "user" | "assistant"; text: string; badge?: "emergency" | "moderate" | "mild" }

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! Describe your symptoms. I’ll assess urgency and suggest next steps." },
    { role: "user", text: "I have chest pain and shortness of breath." },
    { role: "assistant", text: "These symptoms may be serious. Please seek urgent care.", badge: "emergency" },
  ])
  const [pending, setPending] = useState("")

  const send = () => {
    if (!pending.trim()) return
    setMessages((m) => [...m, { role: "user", text: pending }])
    setPending("")
    // This is UI-only; integrate your AI route later.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Thanks. Based on your description, book with a Cardiologist. I can help you schedule.",
          badge: "moderate",
        },
      ])
    }, 500)
  }

  return (
    <Card id="symptoms" className="border-0 shadow-lg ring-1 ring-black/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Bot className="size-4" aria-hidden />
          </span>
          AI Symptom Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* message region with aria-live for updates */}
        <div className="rounded-lg bg-accent/10 p-3 ring-1 ring-accent/20">
          <div
            className="h-64 overflow-y-auto rounded-md bg-white/60 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/40"
            aria-live="polite"
            aria-relevant="additions"
          >
            <ul className="space-y-3">
              {messages.map((m, i) => (
                <li key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      "inline-flex max-w-[85%] flex-col items-start gap-2 rounded-2xl px-3 py-2 text-sm " +
                      (m.role === "assistant"
                        ? "bg-white text-foreground ring-1 ring-black/10"
                        : "bg-primary text-primary-foreground")
                    }
                  >
                    <div className="flex items-center gap-2">
                      {/* avatar chip */}
                      <span
                        className={
                          "inline-flex size-5 items-center justify-center rounded-full " +
                          (m.role === "assistant"
                            ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                            : "bg-white/20 text-white")
                        }
                        aria-hidden
                      >
                        {m.role === "assistant" ? <Bot className="size-3" /> : <span className="text-[10px]">You</span>}
                      </span>
                      {m.badge ? <UrgencyBadge level={m.badge} /> : null}
                    </div>
                    <p className="text-pretty">{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* quick suggestions */}
        <div className="flex flex-wrap gap-2">
          {["Fever and cough", "Headache and nausea", "Back pain"].map((q) => (
            <Button
              key={q}
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent"
              onClick={() => setPending(q)}
              aria-label={`Use suggestion: ${q}`}
            >
              {q}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            placeholder="Describe your symptoms..."
            aria-label="Message input"
          />
          <Button onClick={send} aria-label="Send message">
            <SendHorizonal className="mr-2 size-4" aria-hidden />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}