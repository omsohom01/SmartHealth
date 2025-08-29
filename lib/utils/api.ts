import type { AnalysisResponse } from "@/lib/types/medical-analysis"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function analyzeImage(
  imageFile: File,
  modelKey: string,
): Promise<AnalysisResponse> {
  const formData = new FormData()
  formData.append("image", imageFile)
  formData.append("model", modelKey)

  const response = await fetch("/api/analyze-image", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.error || `Request failed with status ${response.status}`,
      response.status,
      errorData.code,
    )
  }

  return response.json()
}

export function validateImageFile(file: File): string | null {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return "Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)"
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return "Image file too large. Maximum size is 10MB"
  }

  // Check for supported formats
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
  
  if (!supportedTypes.includes(file.type)) {
    return "Unsupported image format. Please use PNG, JPG, JPEG, GIF, or WebP"
  }

  return null
}
