export interface MedicalAnalysisResult {
  label: string
  score: number
}

export interface AnalysisResponse {
  success: boolean
  results?: MedicalAnalysisResult[]
  error?: string
  modelUsed?: string
  suggestions?: string
  explanation?: string
  disclaimer?: string
  source?: string
  detectedType?: string
  detectionConfidence?: number
  detectionReasoning?: string
}

export interface ModelConfig {
  id: string
  name: string
  description: string
  acceptedTypes: string[]
}
