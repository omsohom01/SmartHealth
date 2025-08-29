import { type NextRequest, NextResponse } from "next/server"
import type { AnalysisResponse } from "@/lib/types/medical-analysis"
import { MEDICAL_MODELS } from "@/lib/utils/medical-models"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const modelKey = (formData.get("model") as string) || "xray"

    if (!file) {
      return NextResponse.json<AnalysisResponse>(
        {
          success: false,
          error: "No image file provided",
        },
        { status: 400 },
      )
    }

    const model = MEDICAL_MODELS[modelKey]
    if (!model) {
      return NextResponse.json<AnalysisResponse>(
        {
          success: false,
          error: "Invalid model specified",
        },
        { status: 400 },
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Call Hugging Face API
    const response = await fetch(`https://api-inference.huggingface.co/models/${model.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Hugging Face API Error:", errorText)

      return NextResponse.json<AnalysisResponse>(
        {
          success: false,
          error: `Analysis failed: ${response.status} ${response.statusText}`,
        },
        { status: response.status },
      )
    }

    const results = await response.json()

    // Handle different response formats
    let analysisResults
    if (Array.isArray(results)) {
      analysisResults = results.map((result) => ({
        label: result.label || result.class || "Unknown",
        score: result.score || result.confidence || 0,
      }))
    } else if (results.label || results.class) {
      analysisResults = [
        {
          label: results.label || results.class,
          score: results.score || results.confidence || 0,
        },
      ]
    } else {
      return NextResponse.json<AnalysisResponse>(
        {
          success: false,
          error: "Unexpected response format from AI model",
        },
        { status: 500 },
      )
    }

    return NextResponse.json<AnalysisResponse>({
      success: true,
      results: analysisResults,
      modelUsed: model.name,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json<AnalysisResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
