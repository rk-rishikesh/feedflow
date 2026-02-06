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

        // Phase 1: Architect the Visual Concept (JSON)
        const architectParts = [
            { text: IMAGE_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nAnalyze the provided Knowledge Context and architect a unique visual strategy with your internal thought process.` }
        ];

        if (knowledgeContext) {
            architectParts.push({ text: `--- KNOWLEDGE CONTEXT FROM SOURCE AGENTS ---\n${JSON.stringify(knowledgeContext, null, 2)}` });
        } else {
            sources.forEach((s: any, i: number) => {
                architectParts.push({ text: `--- SOURCE ${i} (${s.type}) ---\n${s.url}` });
            });
        }

        const architectResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: architectParts }],
            config: { responseMimeType: "application/json" }
        });

        if (!architectResponse.text) throw new Error("Failed to architect visual strategy");
        const visualStrategy = JSON.parse(architectResponse.text);

        console.log("Visual Strategy Architected:", visualStrategy.visual_prompt);

        // Phase 2: Native Image Generation (Exact User Pattern)
        let imageBase64 = "";
        try {
            console.log("Synthesizing native visual with gemini-2.5-flash-image...");

            // Following the user's snippet exactly
            const imageResponse = await (ai.models as any).generateContent({
                model: "gemini-2.5-flash-image",
                contents: [{ role: "user", parts: [{ text: visualStrategy.visual_prompt }] }],
            });

            const candidates = (imageResponse as any).candidates || (imageResponse as any).response?.candidates;
            if (candidates && candidates[0]?.content?.parts) {
                for (const part of candidates[0].content.parts) {
                    if (part.text) {
                        console.log("Text part found:", part.text);
                    } else if (part.inlineData) {
                        imageBase64 = part.inlineData.data;
                        console.log("SUCCESS: Image captured via gemini-2.5-flash-image.");
                        break;
                    }
                }
            }

            // Fallback to gemini-2.0-flash if attempt 1 yields no image
            if (!imageBase64) {
                console.log("No image from 2.5, falling back to gemini-2.0-flash...");
                const fallbackResponse = await (ai.models as any).generateContent({
                    model: "gemini-2.0-flash",
                    contents: [{ role: "user", parts: [{ text: `Generate an image for: ${visualStrategy.visual_prompt}` }] }],
                });
                const fallbackCandidates = (fallbackResponse as any).candidates || (fallbackResponse as any).response?.candidates;
                if (fallbackCandidates && fallbackCandidates[0]?.content?.parts) {
                    for (const part of fallbackCandidates[0].content.parts) {
                        if (part.inlineData) {
                            imageBase64 = part.inlineData.data;
                            console.log("SUCCESS: Image captured via 2.0-flash fallback.");
                            break;
                        }
                    }
                }
            }

        } catch (imgError: any) {
            console.error("Critical Image Model Error:", imgError);
            // If the model name is wrong or restricted, attempt standard imagen-3 via generateImages
            try {
                const imgModels = ai.models as any;
                if (imgModels && typeof imgModels.generateImages === 'function') {
                    const res = await imgModels.generateImages({
                        model: "imagen-3.0-generate-001",
                        prompt: visualStrategy.visual_prompt,
                        config: { number_of_images: 1 }
                    });
                    const images = res.generatedImages || res.generated_images;
                    if (images?.length > 0) imageBase64 = images[0].image.data || images[0].image.base64 || "";
                    if (imageBase64) console.log("SUCCESS: Image generated via imagen-3.0-generate-001 fallback.");
                }
            } catch (e) {
                console.error("Final fallback failed.");
            }
        }

        return NextResponse.json({
            thoughtProcess: visualStrategy.thoughtProcess,
            visual_prompt: visualStrategy.visual_prompt,
            aesthetic_description: visualStrategy.aesthetic_description,
            imageBase64: imageBase64
        });

    } catch (error: any) {
        console.error("Image Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
