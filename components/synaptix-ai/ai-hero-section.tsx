"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Sparkles, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIHeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="container mx-auto px-4 lg:px-12 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div
            className={cn("space-y-6 lg:space-y-8", isVisible ? "animate-fade-in" : "opacity-0")}
            style={{ animationDelay: "0.2s" }}
          >
            {/* AI Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 border border-blue-700/30 text-blue-200 text-sm font-medium tracking-wider backdrop-blur-sm group hover:border-blue-600/50 transition-all duration-500">
              <Brain className="w-4 h-4 mr-3 animate-pulse" />
              ARTIFICIAL INTELLIGENCE
              <Sparkles className="w-4 h-4 ml-3 animate-scale-pulse" />
            </div>

            {/* Main Title */}
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-center">
                <span className="text-white text-reveal block mb-4">Meet Synaptix AI</span>
                <span
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent text-reveal block"
                  style={{ animationDelay: "0.3s" }}
                >
                  Your 24/7 Medical Assistant
                </span>
              </h1>

              {/* Glowing effect behind title */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 blur-3xl opacity-50 animate-pulse"></div>
            </div>

            {/* Subtext */}
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              Ask symptoms, get insights, and connect with doctors instantly through our advanced AI-powered medical
              assistant.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 lg:px-12 py-4 lg:py-5 rounded-xl text-base lg:text-lg font-medium tracking-wider transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 border border-blue-500/20"
              >
                <span className="relative z-10 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Start Chatting
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group relative overflow-hidden bg-transparent border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 lg:px-12 py-4 lg:py-5 rounded-xl text-base lg:text-lg font-medium tracking-wider transition-all duration-500"
              >
                <span className="relative z-10 flex items-center">
                  Learn More
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            {/* AI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-gray-800/50 max-w-2xl mx-auto">
              {[
                { number: "99.9%", label: "ACCURACY", delay: "0s" },
                { number: "24/7", label: "AVAILABLE", delay: "0.2s" },
                { number: "1M+", label: "QUERIES", delay: "0.4s" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div
                    className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 opacity-0 animate-fade-in"
                    style={{ animationDelay: stat.delay }}
                  >
                    {stat.number}
                  </div>
                  <div
                    className="text-gray-500 text-sm tracking-wider opacity-0 animate-fade-in"
                    style={{ animationDelay: `calc(${stat.delay} + 0.2s)` }}
                  >
                    {stat.label}
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
