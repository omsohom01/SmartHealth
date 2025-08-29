import { HeroSection } from "@/app/home/hero-section"
import { FeaturesSection } from "@/app/home/features-section"
import { HowItWorksSection } from "@/app/home/how-it-works-section"
import { TestimonialsSection } from "@/app/home/testimonials-section"
import { FAQSection } from "@/app/home/faq-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-foreground">
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
    </div>
  )
}
