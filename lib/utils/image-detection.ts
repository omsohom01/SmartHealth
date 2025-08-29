import { GoogleGenerativeAI } from "@google/generative-ai"
import { MEDICAL_MODELS } from "./medical-models"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function detectImageType(imageBuffer: Buffer): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    // Convert buffer to base64 for Gemini
    const base64Image = imageBuffer.toString('base64')
    
    const prompt = `
Analyze this medical image and determine what type of medical image it is. 

Available categories:
1. xray - Chest X-rays, lung images, respiratory system
2. dermatology - Skin conditions, lesions, moles, rashes, dermatological images
3. diabetic_retinopathy - Retinal images showing diabetic retinopathy
4. glaucoma - Retinal images for glaucoma detection
5. alzheimer - Brain MRI scans for Alzheimer's detection
6. musculoskeletal - Bone, joint, fracture, orthopedic images
7. wound - Wound images, injuries, cuts, burns

Look at the image carefully and respond with ONLY the category name (e.g., "xray", "dermatology", "wound", etc.) that best matches this medical image.

If you cannot determine the type clearly, respond with "xray" as the default.
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ])

    const response = result.response.text().trim().toLowerCase()
    
    // Validate that the response is a valid model key
    if (MEDICAL_MODELS[response]) {
      return response
    }
    
    // If invalid response, try to extract known model names
    for (const modelKey of Object.keys(MEDICAL_MODELS)) {
      if (response.includes(modelKey)) {
        return modelKey
      }
    }
    
    // Default fallback
    return "xray"
    
  } catch (error) {
    console.error("Error detecting image type:", error)
    // Fallback to xray if AI detection fails
    return "xray"
  }
}

export async function analyzeWithAutoDetection(imageBuffer: Buffer, fileName: string): Promise<{
  detectedType: string
  confidence: number
  reasoning: string
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const base64Image = imageBuffer.toString('base64')
    
    const prompt = `
Analyze this medical image and determine what type of medical image it is with confidence reasoning.

Available categories:
1. xray - Chest X-rays, lung images, respiratory system
2. dermatology - Skin conditions, lesions, moles, rashes, dermatological images  
3. diabetic_retinopathy - Retinal images showing diabetic retinopathy
4. glaucoma - Retinal images for glaucoma detection
5. alzheimer - Brain MRI scans for Alzheimer's detection
6. musculoskeletal - Bone, joint, fracture, orthopedic images
7. wound - Wound images, injuries, cuts, burns

Filename: ${fileName}

Respond in this exact format:
TYPE: [category_name]
CONFIDENCE: [0-100]
REASONING: [brief explanation of why you classified it this way]
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ])

    const response = result.response.text()
    
    // Parse the response
    const typeMatch = response.match(/TYPE:\s*(\w+)/)
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/)
    const reasoningMatch = response.match(/REASONING:\s*(.+)/)
    
    const detectedType = typeMatch?.[1]?.toLowerCase() || "xray"
    const confidence = parseInt(confidenceMatch?.[1] || "50")
    const reasoning = reasoningMatch?.[1]?.trim() || "Auto-detected based on image analysis"
    
    // Validate detected type
    const validType = MEDICAL_MODELS[detectedType] ? detectedType : "xray"
    
    return {
      detectedType: validType,
      confidence: Math.min(100, Math.max(0, confidence)),
      reasoning
    }
    
  } catch (error) {
    console.error("Error in auto-detection analysis:", error)
    return {
      detectedType: "xray",
      confidence: 50,
      reasoning: "Auto-detection failed, using default classification"
    }
  }
}
