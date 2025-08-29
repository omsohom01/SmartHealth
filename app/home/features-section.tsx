import { Brain, MessageSquare, CalendarCheck, LayoutDashboard, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Medical Assistant",
      description: "Advanced AI provides instant, reliable answers to your health questions with medical accuracy.",
    },
    {
      icon: MessageSquare,
      title: "Verified Doctor Consultations",
      description: "Connect securely with licensed medical professionals for personalized healthcare advice.",
    },
    {
      icon: CalendarCheck,
      title: "Virtual Appointments",
      description: "Schedule and attend video consultations with specialists at your convenience.",
    },
    {
      icon: LayoutDashboard,
      title: "Unified Dashboard",
      description: "Manage appointments, medical history, and health progress in one secure platform.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access medical support and health information anytime, anywhere in the world.",
    },
  ]

  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-950 px-4 lg:px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-48 h-48 bg-white/3 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <div className="container mx-auto relative">
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/30 border border-gray-700/30 text-gray-300 text-sm font-medium tracking-wider mb-6">
            FEATURES
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 tracking-tight relative">
            Healthcare Redefined
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl opacity-50"></div>
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Experience the future of medical care through our innovative platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 border-gray-700/50 text-left p-6 lg:p-8 rounded-2xl shadow-2xl transition-all duration-700 hover:from-gray-900/60 hover:via-gray-800/50 hover:to-gray-900/60 hover:border-gray-600/70 magnetic-hover animate-border-dance overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="p-0 mb-4 lg:mb-6 relative">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                      <feature.icon className="h-6 w-6 lg:h-7 lg:w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -inset-2 bg-white/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-right opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-xs text-gray-500 tracking-wider">0{index + 1}</div>
                  </div>
                </div>
                <CardTitle className="text-lg lg:text-xl font-bold text-white mb-3 lg:mb-4 tracking-wide group-hover:text-gray-100 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-gray-400 text-sm lg:text-base leading-relaxed font-light group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </CardDescription>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
