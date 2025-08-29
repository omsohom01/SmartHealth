"use client"

import { Brain, Stethoscope, Activity, Shield, MessageCircle } from "lucide-react"

export function AIBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient - professional dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Subtle animated gradient overlays - minimal colors */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/5 via-transparent to-gray-700/5 animate-gradient-shift bg-[300%_300%]" />
      <div
        className="absolute inset-0 bg-gradient-to-bl from-transparent via-gray-600/3 to-transparent animate-gradient-shift bg-[300%_300%]"
        style={{ animationDelay: "8s" }}
      />

      {/* Professional floating orbs - very subtle */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-float opacity-40"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl animate-float opacity-40"
        style={{ animationDelay: "12s" }}
      ></div>
      <div
        className="absolute top-3/4 left-3/4 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl animate-float opacity-40"
        style={{ animationDelay: "18s" }}
      ></div>

      {/* Professional geometric shapes */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gray-700/20 rounded-lg rotate-45 animate-rotate-slow"></div>
        <div
          className="absolute bottom-32 right-32 w-24 h-24 border border-gray-600/20 rounded-full animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-gray-700/20 rotate-12 animate-float"></div>
        <div
          className="absolute bottom-20 left-1/3 w-20 h-20 border border-gray-600/20 rounded-lg rotate-12 animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Minimal floating icons - very subtle */}
      <div className="absolute inset-0 opacity-[0.08]">
        <Brain
          className="absolute top-20 left-20 w-6 h-6 text-gray-400 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Stethoscope
          className="absolute top-40 right-32 w-7 h-7 text-gray-400 animate-float"
          style={{ animationDelay: "4s" }}
        />
        <Activity
          className="absolute bottom-32 left-40 w-5 h-5 text-gray-400 animate-float"
          style={{ animationDelay: "8s" }}
        />
        <MessageCircle
          className="absolute bottom-20 left-1/3 w-6 h-6 text-gray-400 animate-float"
          style={{ animationDelay: "12s" }}
        />
        <Shield
          className="absolute top-32 right-1/4 w-5 h-5 text-gray-400 animate-float"
          style={{ animationDelay: "16s" }}
        />
      </div>

      {/* Professional grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Subtle connection lines */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(156, 163, 175)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M 0,200 Q 400,100 800,300 T 1600,200"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: "8s" }}
          />
        </svg>
      </div>

      {/* Professional radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-gray-950/50 to-gray-950/90"></div>
    </div>
  )
}
