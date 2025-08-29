import { VisionBackground } from "@/components/synaptix-vision/vision-background"
import { ImageChecker } from "@/components/synaptix-vision/image-checker"

export default function SynaptixVisionPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-foreground relative overflow-hidden">
      <VisionBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] py-12 px-4 lg:px-6">
        <ImageChecker />
      </main>
    </div>
  )
}
