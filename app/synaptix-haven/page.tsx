"use client"

import { HavenBackground } from "../../components/synaptix-haven/haven-background"
import { HavenChat } from "../../components/synaptix-haven/haven-chat"

export default function SynaptixHavenPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#070711] text-white mt-16">
      {/* <HavenBackground /> */}
      <HavenChat />
    </main>
  )
}
