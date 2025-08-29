"use client"

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base very dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Animated gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.01] animate-gradient-shift bg-[200%_200%]" />
      <div
        className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/[0.01] to-transparent animate-gradient-shift bg-[200%_200%]"
        style={{ animationDelay: "4s" }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl animate-float"
        style={{ animationDelay: "6s" }}
      ></div>
      <div
        className="absolute top-3/4 left-3/4 w-48 h-48 bg-white/[0.015] rounded-full blur-3xl animate-float"
        style={{ animationDelay: "12s" }}
      ></div>

      {/* Enhanced grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-gray-950/50"></div>
    </div>
  )
}
