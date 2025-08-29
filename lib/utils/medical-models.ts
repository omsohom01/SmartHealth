import type { ModelConfig } from "@/lib/types/medical-analysis"

export const MEDICAL_MODELS: Record<string, ModelConfig> = {
  xray: {
    id: "SicariusSicariiStuff/X-Ray_Alpha",
    name: "X-Ray Analysis",
    description: "Analyzes chest X-rays and respiratory conditions",
    acceptedTypes: ["chest", "xray", "x-ray", "lung", "pneumonia", "respiratory"],
  },
  dermatology: {
    id: "dima806/skin_cancer_image_detection",
    name: "Dermatology Analysis", 
    description: "Analyzes skin conditions and dermatological findings",
    acceptedTypes: ["skin", "dermatology", "mole", "lesion", "rash", "acne", "eczema", "psoriasis"],
  },
  diabetic_retinopathy: {
    id: "HuggingFaceM4/diabetic-retinopathy-classification",
    name: "Diabetic Retinopathy Detection",
    description: "Detects diabetic retinopathy in retinal images",
    acceptedTypes: ["retina", "retinal", "diabetic", "retinopathy", "eye", "fundus", "ophthalmology"],
  },
  glaucoma: {
    id: "keremberke/yolov8n-glaucoma-detection",
    name: "Glaucoma Detection",
    description: "Classifies glaucoma in retinal images", 
    acceptedTypes: ["glaucoma", "optic", "nerve", "eye", "retina", "retinal", "ophthalmology"],
  },
  alzheimer: {
    id: "Falconsai/nsfw_image_detection",
    name: "Alzheimer's MRI Analysis",
    description: "Analyzes brain MRI scans for neurological conditions",
    acceptedTypes: ["alzheimer", "brain", "mri", "neurological", "dementia", "cognitive", "neurology"],
  },
  musculoskeletal: {
    id: "microsoft/resnet-50",
    name: "Musculoskeletal Analysis",
    description: "Detects abnormalities in bone and joint images",
    acceptedTypes: ["bone", "fracture", "joint", "muscle", "skeletal", "orthopedic", "musculoskeletal"],
  },
  wound: {
    id: "microsoft/resnet-50",
    name: "Wound Assessment",
    description: "Classifies wound types and healing stages",
    acceptedTypes: ["wound", "injury", "cut", "burn", "healing", "ulcer", "sore"],
  },
}

export function detectModelFromFilename(filename: string): string {
  const lowerFilename = filename.toLowerCase()

  for (const [key, model] of Object.entries(MEDICAL_MODELS)) {
    if (model.acceptedTypes.some((type) => lowerFilename.includes(type))) {
      return key
    }
  }

  // Default to X-ray model
  return "xray"
}

export function getModelById(modelKey: string): ModelConfig | null {
  return MEDICAL_MODELS[modelKey] || null
}
