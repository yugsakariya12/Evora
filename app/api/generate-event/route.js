import OpenAI from "openai";
import { NextResponse } from "next/server";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are an event planning assistant.

Return ONLY valid JSON in this exact format:
{
  "title": "Event title (single line)",
  "description": "2-3 sentence single paragraph description",
  "category": "tech | music | sports | art | food | business | health | education | gaming | networking | outdoor | community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

Rules:
- JSON only
- No markdown
- No explanations
- No line breaks inside strings
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ UPDATED MODEL
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content.trim();
    const eventData = JSON.parse(text);

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Groq error:", error);
    return NextResponse.json(
      { error: "Failed to generate event" },
      { status: 500 }
    );
  }
}
