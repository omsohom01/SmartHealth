"use client"

// Futuristic, calm background with glowing gradients and aurora/particles
export function HavenBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0714] via-[#080a16] to-[#06060c]" />

      {/* Aurora waves */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-1/4 top-0 h-[120vh] w-[60vw] rounded-full blur-[100px] bg-gradient-to-b from-[#6b21a8]/30 via-[#06b6d4]/20 to-transparent animate-[gradient-shift_16s_ease_infinite]" />
        <div className="absolute -right-1/4 bottom-0 h-[120vh] w-[60vw] rounded-full blur-[100px] bg-gradient-to-t from-[#2563eb]/25 via-[#06b6d4]/15 to-transparent animate-[gradient-shift_18s_ease_infinite]" />
      </div>

      {/* Soft radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-[#7c3aed]/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-[#22d3ee]/15 blur-[80px]" />
      </div>

      {/* Subtle starfield particles */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.25]">
        {[...Array(60)].map((_, i) => (
          <circle
            key={i}
            cx={`${(i * 163) % 100}%`}
            cy={`${(i * 79) % 100}%`}
            r={(i % 3) + 0.5}
            fill={i % 2 === 0 ? "#93c5fd" : "#c084fc"}
            className="animate-pulse"
            style={{ animationDuration: `${6 + (i % 7)}s`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </svg>

      {/* Scanline/grain overlays */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 50%, transparent)",
          backgroundSize: "100% 180px",
          animation: "scanline-move 20s linear infinite",
        }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/70" />
    </div>
  )
}
