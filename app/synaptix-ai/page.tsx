import { ChatInterface } from "@/components/synaptix-ai/chat-interface"
import { AIBackground } from "@/components/synaptix-ai/ai-background"

export default function SynaptixAIPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-foreground relative overflow-hidden">
      <AIBackground />
      <main className="relative z-10 h-screen flex flex-col">
        <ChatInterface />
      </main>
    </div>
  )
}
