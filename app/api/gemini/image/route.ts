import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const IMAGE_SYSTEM_PROMPT = `
Role: You are a Expert Visual Prompt Engineer. Your goal is to translate abstract concepts and technical information into vivid, cinematic image generation prompts for AI tools like DALL-E, Midjourney, or Stable Diffusion.
Styles:
- PHOTOREALISTIC: High detail, cinematic lighting, 8k resolution style.
- MINIMALIST 3D: Clean lines, soft shadows, isometric or abstract tech vibes.
- CYBERPUNK: High contrast, neon colors, futuristic tech aesthetics.
- HAND-DRAWN ILLUSTRATION: Textured, artistic, human-centric storytelling style.

Output Structure (JSON ONLY):
{
  "visual_prompt": "A detailed image generation prompt",
  "aesthetic_description": "A brief explanation of the visual choice"
}
`;

export async function POST(req: Request) {
    try {
        const { sources, style, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: IMAGE_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nCreate a visual brief in the ${style.toUpperCase()} style.` }
        ];

        if (knowledgeContext) {
            parts.push({ text: `--- KNOWLEDGE CONTEXT ---\n${JSON.stringify(knowledgeContext, null, 2)}` });
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

        return NextResponse.json({ text: response.text });
    } catch (error: any) {
        console.error("Image Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
