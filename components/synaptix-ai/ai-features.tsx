import { Brain, Shield, Clock, Zap, Users, Heart } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AIFeatures() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Intelligence",
      description: "Powered by cutting-edge machine learning algorithms trained on vast medical datasets.",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health data is protected with enterprise-grade security and privacy measures.",
      gradient: "from-green-500/20 to-blue-500/20",
    },
    {
      icon: Clock,
      title: "Instant Responses",
      description: "Get immediate answers to your health questions, available 24/7 without waiting.",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Zap,
      title: "Smart Symptom Analysis",
      description: "Intelligent symptom checker that helps identify potential health concerns.",
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
      icon: Users,
      title: "Doctor Integration",
      description: "Seamlessly connect with verified doctors when human expertise is needed.",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Tailored health insights based on your medical history and preferences.",
      gradient: "from-red-500/20 to-pink-500/20",
    },
  ]

  return (
    <section className="py-16 lg:py-24 px-4 lg:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/30 border border-gray-700/30 text-gray-300 text-sm font-medium tracking-wider mb-6">
            AI CAPABILITIES
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 tracking-tight">
            Why Choose Synaptix AI?
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Experience the future of healthcare with our intelligent AI assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative bg-gray-900/40 border-gray-700/50 text-left p-6 lg:p-8 rounded-2xl shadow-2xl transition-all duration-700 hover:bg-gray-900/60 hover:border-gray-600/70 magnetic-hover overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
              ></div>

              <CardHeader className="p-0 mb-4 lg:mb-6 relative z-10">
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
              <CardDescription className="text-gray-400 text-sm lg:text-base leading-relaxed font-light group-hover:text-gray-300 transition-colors duration-300 relative z-10">
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
