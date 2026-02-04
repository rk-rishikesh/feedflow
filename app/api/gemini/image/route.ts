import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const IMAGE_SYSTEM_PROMPT = `
Role: You are an Expert Visual Architect Agent. Your goal is to translate complex technical information and narratives into vivid, high-impact visual concepts and image generation prompts.
Source Material: You will be provided with a rich "Knowledge Context" containing FULL transcripts, flattened codebases, and deep insights from source agents.

Agent-to-Agent Communication:
You are receiving this data from specialized Extraction Agents. Your task is to:
1. Deconstruct the "vibe" and core metaphors present in the technical data.
2. Conceptualize a visual representation that captures the essence of the combined sources.
3. Show your "Thought Process" - explain which technical or narrative metaphors you decided to visualize and why they create the best visual story.
4. Generate the final visual brief.

Output Structure (JSON ONLY):
{
  "thoughtProcess": "A detailed explanation of how you translated technical data into visual metaphors.",
  "visual_prompt": "A detailed image generation prompt",
  "aesthetic_description": "A brief explanation of the visual choice"
}
`;

export async function POST(req: Request) {
    try {
        const { sources, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: IMAGE_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nAnalyze the provided Knowledge Context and architect a unique visual strategy with your internal thought process.` }
        ];

        if (knowledgeContext) {
            parts.push({ text: `--- KNOWLEDGE CONTEXT FROM SOURCE AGENTS ---\n${JSON.stringify(knowledgeContext, null, 2)}` });
        } else {
            sources.forEach((s: any, i: number) => {
                parts.push({ text: `--- SOURCE ${i} (${s.type}) ---\n${s.url}` });
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts }],
            config: { responseMimeType: "application/json" }
        });

        if (!response.text) throw new Error("Failed to generate content");
        return NextResponse.json({ text: response.text });
    } catch (error: any) {
        console.error("Image Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
