"use client"

import { Eye, Scan, Target, Focus } from "lucide-react"

export function VisionBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base professional dark gradient - monochromatic */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Subtle monochromatic animated gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/3 via-transparent to-gray-700/3 animate-gradient-shift bg-[300%_300%]" />
      <div
        className="absolute inset-0 bg-gradient-to-bl from-transparent via-gray-600/2 to-transparent animate-gradient-shift bg-[300%_300%]"
        style={{ animationDelay: "8s" }}
      />

      {/* Professional scanlines - very subtle */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
          backgroundSize: "100% 200px",
          animation: "scanline-move 25s linear infinite",
        }}
      />

      {/* Monochromatic floating orbs - extremely subtle */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl animate-float opacity-40"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl animate-float opacity-40"
        style={{ animationDelay: "12s" }}
      ></div>
      <div
        className="absolute top-3/4 left-3/4 w-64 h-64 bg-white/[0.008] rounded-full blur-3xl animate-float opacity-40"
        style={{ animationDelay: "18s" }}
      ></div>

      {/* Professional geometric shapes - monochromatic */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-700/15 rounded-full animate-rotate-slow"></div>
        <div
          className="absolute bottom-32 right-32 w-24 h-24 border border-gray-600/15 rounded-lg rotate-45 animate-pulse"
          style={{ animationDuration: "6s" }}
        ></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-gray-700/15 rotate-12 animate-float"></div>
        <div
          className="absolute bottom-20 left-1/3 w-20 h-20 border border-gray-600/15 rounded-full animate-float"
          style={{ animationDelay: "8s" }}
        ></div>
      </div>

      {/* Minimal floating icons - monochromatic */}
      <div className="absolute inset-0 opacity-[0.06]">
        <Eye className="absolute top-20 left-20 w-5 h-5 text-gray-500 animate-float" style={{ animationDelay: "0s" }} />
        <Scan
          className="absolute top-40 right-32 w-6 h-6 text-gray-500 animate-float"
          style={{ animationDelay: "6s" }}
        />
        <Target
          className="absolute bottom-20 left-1/3 w-5 h-5 text-gray-500 animate-float"
          style={{ animationDelay: "12s" }}
        />
        <Focus
          className="absolute bottom-1/3 right-1/3 w-5 h-5 text-gray-500 animate-float"
          style={{ animationDelay: "18s" }}
        />
      </div>

      {/* Professional grid pattern - very subtle */}
      <div
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Subtle connection lines - monochromatic */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="visionLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="rgb(156, 163, 175)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(156, 163, 175)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M 0,200 Q 400,100 800,300 T 1600,200"
            stroke="url(#visionLineGradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: "12s" }}
          />
        </svg>
      </div>

      {/* Professional radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-gray-950/50 to-gray-950/90"></div>
    </div>
  )
}
