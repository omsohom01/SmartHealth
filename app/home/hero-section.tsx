"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { AnimatedGradient } from "./animated-gradient"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function HeroSection() {
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
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatedGradient />

      <div className="container mx-auto px-4 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left side - Content */}
          <div className="order-1 lg:order-1 text-center lg:text-left">
            <div
              className={cn("space-y-2 lg:space-y-4 mt-4", isVisible ? "animate-slide-in-right" : "opacity-0")}
              style={{ animationDelay: "0.4s" }}
            >
              {/* Enhanced Badge */}
              <div className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-gradient-to-r from-gray-800/40 via-gray-700/40 to-gray-800/40 border border-gray-600/30 text-gray-200 text-xs font-medium tracking-wider backdrop-blur-sm group hover:border-gray-500/50 transition-all duration-500 mt-12">
                <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-white rounded-full mr-2 lg:mr-3 animate-pulse"></div>
                AI-POWERED HEALTHCARE
                <div className="ml-2 lg:ml-3 w-0.5 lg:w-1 h-0.5 lg:h-1 bg-white/60 rounded-full animate-ping"></div>
              </div>

              {/* Enhanced Main heading with perfect centering and dark colors only */}
              <div className="relative -top-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                  <span className="text-white block mt-16">
                    <span className="text-white">Smarter </span>
                    <span className="text-gray-300">Healthcare</span>
                    <span className="text-white">, Powered by </span>
                    <span className="text-gray-500">AI</span>
                    <span className="text-white"> and Real </span>
                    <span className="text-gray-500/80">Doctors</span>
                  </span>
                </h1>
              </div>

              {/* Enhanced Subtext */}
              <div className="text-sm sm:text-base lg:text-lg text-gray-300 leading-normal max-w-xl mx-auto lg:mx-0 font-light relative text-center lg:text-left">
                Connect with verified doctors and get instant AI insights through our cutting-edge platform.
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl opacity-30"></div>
              </div>

              {/* Enhanced CTA Button */}
              <div className="pt-2 lg:pt-4 flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-white text-black hover:bg-gray-100 px-8 lg:px-12 py-3 lg:py-4 rounded-xl text-sm lg:text-base font-medium tracking-wider transition-all duration-500 magnetic-hover shadow-xl hover:shadow-2xl hover:scale-105 border border-gray-200/20"
                >
                  <span className="relative z-10 flex items-center">
                    GET STARTED
                    <div className="ml-2 lg:ml-3 relative">
                      <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                      <div className="absolute inset-0 w-4 lg:w-5 h-4 lg:h-5 bg-black/20 rounded-full scale-0 group-hover:scale-150 transition-all duration-300 -z-10"></div>
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 lg:w-2 h-1.5 lg:h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300"></div>
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 lg:pt-6 border-t border-gray-700/50 mt-4">
                {[
                  { number: "10K+", label: "PATIENTS", delay: "0s" },
                  { number: "500+", label: "DOCTORS", delay: "0.2s" },
                  { number: "24/7", label: "SUPPORT", delay: "0.4s" },
                ].map((stat, index) => (
                  <div key={index} className="text-center lg:text-left group">
                    <div
                      className="text-lg lg:text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300 opacity-0 animate-fade-in"
                      style={{ animationDelay: stat.delay }}
                    >
                      {stat.number}
                    </div>
                    <div
                      className="text-gray-500 text-xs lg:text-sm tracking-wider opacity-0 animate-fade-in"
                      style={{ animationDelay: `calc(${stat.delay} + 0.2s)` }}
                    >
                      {stat.label}
                    </div>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Enhanced Image */}
          <div
            className={cn("relative order-2 lg:order-2", isVisible ? "animate-slide-in-left" : "opacity-0")}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative group max-w-sm lg:max-w-md mx-auto">
              {/* Subtle glow effects */}
              <div className="absolute -inset-4 lg:-inset-6 bg-gradient-to-r from-white/8 via-white/4 to-white/8 rounded-2xl lg:rounded-3xl blur-xl lg:blur-2xl group-hover:from-white/12 group-hover:via-white/8 group-hover:to-white/12 transition-all duration-1000"></div>

              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-gray-900/20 via-gray-800/20 to-gray-900/20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-gray-700/30 group-hover:border-gray-600/50 transition-all duration-700">
                <div className="relative overflow-hidden rounded-lg lg:rounded-2xl">
                  <Image
                    src="/placeholder.svg?height=400&width=350"
                    alt="Medical consultation"
                    width={350}
                    height={400}
                    className="w-full h-auto shadow-2xl group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Image overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
