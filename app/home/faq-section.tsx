"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqs = [
    {
      question: "Is the AI Chatbot safe and accurate?",
      answer:
        "Our AI chatbot provides general medical information and guidance. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns.",
    },
    {
      question: "How are doctors verified on Synaptix?",
      answer:
        "All doctors undergo rigorous verification including license checks, background verification, and credential validation to ensure you receive care from qualified professionals.",
    },
    {
      question: "What are the operating hours for consultations?",
      answer:
        "Doctors offer flexible appointment times. You can view availability and book virtual appointments 24/7, depending on the doctor's schedule and time zone.",
    },
    {
      question: "Can I get prescriptions through Synaptix?",
      answer:
        "Yes, licensed doctors can issue prescriptions during virtual consultations when deemed appropriate, which can be sent directly to your preferred pharmacy.",
    },
    {
      question: "Is my health information secure?",
      answer:
        "We prioritize your privacy with advanced encryption and strict adherence to data protection regulations, ensuring your personal health information remains confidential and secure.",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gray-950 px-4 lg:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4 lg:mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 font-light">Everything you need to know about our platform</p>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-gray-900/20 border border-gray-800/30 rounded-xl overflow-hidden transition-all duration-500 hover:bg-gray-900/40 hover:border-gray-700/50 magnetic-hover"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 lg:px-8 py-4 lg:py-6 text-left flex items-center justify-between transition-all duration-300 group-hover:px-8 lg:group-hover:px-10"
              >
                <span className="text-base lg:text-lg font-light text-white tracking-wide pr-4">{faq.question}</span>

                <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
                  <Plus
                    className={cn(
                      "absolute w-4 h-4 lg:w-5 lg:h-5 text-gray-400 transition-all duration-500 transform",
                      openItems.includes(index) ? "rotate-45 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
                    )}
                  />
                  <Minus
                    className={cn(
                      "absolute w-4 h-4 lg:w-5 lg:h-5 text-white transition-all duration-500 transform",
                      openItems.includes(index) ? "rotate-0 scale-100 opacity-100" : "rotate-45 scale-0 opacity-0",
                    )}
                  />
                </div>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-700 ease-out",
                  openItems.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "h-px bg-gray-700/50 transition-all duration-700",
                      openItems.includes(index) ? "w-full" : "w-0",
                    )}
                  />

                  <div className="px-6 lg:px-8 pb-4 lg:pb-6 pt-3 lg:pt-4">
                    <div
                      className={cn(
                        "text-gray-400 leading-relaxed font-light text-sm lg:text-base transition-all duration-700",
                        openItems.includes(index)
                          ? "translate-y-0 opacity-100 blur-0 scale-100"
                          : "translate-y-4 opacity-0 blur-sm scale-95",
                      )}
                      style={{
                        transitionDelay: openItems.includes(index) ? "0.2s" : "0s",
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
