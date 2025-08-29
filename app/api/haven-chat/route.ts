import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // Don't throw at import time in production builds; respond with 500 at runtime instead
  // This avoids breaking local builds if env var isn't set
}

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { contents } = await req.json();

    if (!Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json({ error: "Missing or invalid contents." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const formattedContents = contents.map((msg: any) => ({
      role: msg.role,
      parts: msg.parts,
    }));

    // Therapist-focused system prompt (empathetic, safe, non-diagnostic)
  const systemPrompt = {
      role: "model",
      parts: [
        {
          text:
      "You are Synaptix Haven, a compassionate AI mental health assistant.\n\nCore principles:\n1) Listen empathetically and validate feelings.\n2) Offer gentle, practical coping steps (breathing, grounding, journaling, cognitive reframing).\n3) Encourage professional help when appropriate.\n4) Avoid definitive diagnoses or medical directives.\n\nSafety: If self-harm, suicidal ideation, or intent to harm others is mentioned, respond with high empathy, provide crisis resources and immediate steps, and advise contacting local emergency services.\n\nConciseness: Reply in at most 2–3 short sentences. Prefer bullet points only when helpful.\n\nEmotion awareness: If the message includes a tag like [Emotion: anxious|low|angry|engaged|calm], adapt tone and suggestions accordingly (e.g., more grounding for anxious, gentle activation for low mood). Keep the tag private—do not echo it. End with one gentle next step.",
        },
      ],
    };

    const allContents = [systemPrompt, ...formattedContents];

    const result = await model.generateContent({ contents: allContents });
    const response = await result.response;

    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error("Haven Chat Error:", error);
    return NextResponse.json({ error: "Haven chat API error" }, { status: 500 });
  }
}
