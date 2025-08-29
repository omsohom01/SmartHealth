import { cn } from "@/lib/utils"

type Level = "emergency" | "moderate" | "mild"

export function UrgencyBadge({ level }: { level: Level }) {
  const map: Record<Level, { label: string; className: string; aria: string }> = {
    emergency: {
      label: "Emergency",
      className: "bg-[#EF4444] text-white",
      aria: "Emergency level. Seek immediate care.",
    },
    moderate: { label: "Moderate", className: "bg-[#F97316] text-white", aria: "Moderate level. Schedule soon." },
    mild: { label: "Mild", className: "bg-[#22C55E] text-white", aria: "Mild level. Routine care." },
  }
  const s = map[level]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-black/10",
        s.className,
      )}
      aria-label={s.aria}
      role="status"
    >
      {s.label}
    </span>
  )
}