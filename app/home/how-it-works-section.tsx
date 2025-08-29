import { UserPlus, Stethoscope, MessageCircle, Pill } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Set up your secure profile in minutes with our streamlined registration process.",
    },
    {
      icon: Stethoscope,
      title: "Select Specialist",
      description: "Browse verified doctor profiles and choose the right specialist for your needs.",
    },
    {
      icon: MessageCircle,
      title: "Connect & Consult",
      description: "Engage through secure messaging or schedule virtual video appointments.",
    },
    {
      icon: Pill,
      title: "Receive Care",
      description: "Get diagnoses, prescriptions, and comprehensive follow-up care digitally.",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gray-950 px-4 lg:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-4 lg:mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Four simple steps to better healthcare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-gray-900/30 border-gray-800/40 text-center p-6 lg:p-8 rounded-xl shadow-2xl transition-all duration-700 hover:bg-gray-900/50 hover:border-gray-700/60 group magnetic-hover"
            >
              <CardHeader className="p-0 mb-4 lg:mb-6">
                <div className="mx-auto mb-4 lg:mb-6 w-12 h-12 lg:w-16 lg:h-16 bg-gray-700/20 rounded-full flex items-center justify-center group-hover:bg-gray-600/30 transition-colors duration-300 border border-gray-600/20">
                  <step.icon className="h-5 w-5 lg:h-8 lg:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-base lg:text-lg font-light text-white mb-3 lg:mb-4 tracking-wide">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-gray-400 text-xs lg:text-sm leading-relaxed font-light">
                {step.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
