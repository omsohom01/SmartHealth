import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Make sure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { contents } = await req.json();

    if (!Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json({ error: "Missing or invalid contents." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format the conversation history for Gemini
    const formattedContents = contents.map((msg: any) => ({
      role: msg.role,
      parts: msg.parts
    }));

    // Add system prompt for medical AI assistant
    const systemPrompt = {
      role: "model",
      parts: [{ text: "You are Synaptix AI, a helpful medical assistant. Provide accurate, helpful medical information while always recommending users consult with healthcare professionals for serious concerns. Be empathetic and professional in your responses. IMPORTANT: Format your responses using proper markdown syntax:\n\n- Use # for main headings (largest)\n- Use ## for section headings (medium)\n- Use ### for subsections (smaller)\n- Use **bold text** for emphasis\n- Use - or * for bullet points in lists\n- Use 1. 2. 3. for numbered lists\n\nAlways structure your responses with clear headings and organized lists to make medical information easy to read and understand." }]
    };

    const allContents = [systemPrompt, ...formattedContents];

    const result = await model.generateContent({
      contents: allContents,
    });

    const response = await result.response;

    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
  }
}
