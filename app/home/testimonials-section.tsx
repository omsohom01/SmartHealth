"use client"

import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"

function CarouselButtons() {
  return (
    <>
      <div className="absolute left-0 top-0 bottom-0 flex items-center -translate-x-8">
        <CarouselPrevious className="static w-12 h-12 rounded-xl bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white hover:border-gray-500/70 transition-all duration-300 group shadow-lg hover:shadow-xl backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5 group-hover:scale-110 group-hover:-translate-x-0.5 transition-all duration-300" />
        </CarouselPrevious>
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex items-center translate-x-8">
        <CarouselNext className="static w-12 h-12 rounded-xl bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white hover:border-gray-500/70 transition-all duration-300 group shadow-lg hover:shadow-xl backdrop-blur-sm">
          <ArrowRight className="w-5 h-5 group-hover:scale-110 group-hover:translate-x-0.5 transition-all duration-300" />
        </CarouselNext>
      </div>
    </>
  )
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Synaptix has transformed how I manage my health. The AI chatbot is incredibly helpful, and connecting with doctors is seamless!",
      author: "Sarah L.",
      title: "Patient",
  avatar: "/doctor.png",
    },
    {
      quote:
        "As a doctor, Synaptix provides an intuitive platform to connect with patients and manage appointments efficiently. Highly recommended!",
      author: "Dr. Alex M.",
      title: "Verified Doctor",
  avatar: "/doctor.png",
    },
    {
      quote:
        "The virtual appointments feature is a game-changer. I can get expert medical advice from the comfort of my home.",
      author: "John P.",
      title: "Patient",
  avatar: "/doctor.png",
    },
    {
      quote:
        "I was skeptical at first, but the Synaptix chatbot gave me accurate information that helped me understand my symptoms better before seeing a doctor.",
      author: "Emily R.",
      title: "Patient",
  avatar: "/doctor.png",
    },
  ]

  const carouselRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-20 bg-gray-900 text-center px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">What Our Users Say</h2>
        <div className="relative px-8">
          <Carousel
            ref={carouselRef}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 border-gray-700/50 text-left p-6 rounded-xl shadow-xl h-full flex flex-col justify-between transition-all duration-300 hover:border-gray-600/70 hover:from-gray-800/60 hover:to-gray-700/60">
                      <CardContent className="p-0">
                        <p className="text-gray-300 text-lg italic mb-6">&quot;{testimonial.quote}&quot;</p>
                        <div className="flex items-center mt-4">
                          <Image
                            src={testimonial.avatar || "/doctor.png"}
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="rounded-full mr-4 border-2 border-gray-600"
                          />
                          <div>
                            <p className="text-white font-semibold text-lg">{testimonial.author}</p>
                            <p className="text-gray-400 text-sm">{testimonial.title}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselButtons />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
