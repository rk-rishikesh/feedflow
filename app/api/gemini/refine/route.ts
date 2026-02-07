import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const REFINEMENT_SYSTEM_PROMPT = `
Role: You are an Expert Content Editor and Refinement Agent.
Goal: Update existing content based on specific user feedback and original source data.

Communication Context: 
You are acting as an editor reviewing work produced by another AI agent. 
You have access to:
1. The ORIGINAL CONTENT produced.
2. The ORIGINAL THOUGHT PROCESS of the previous agent.
3. The KNOWLEDGE CONTEXT (raw data from sources).
4. The USER'S REFINEMENT INSTRUCTIONS.

Task:
- Rewrite the content according to the instructions.
- Maintain the platform's specific format (e.g., if it's a Twitter thread, return a thread).
- If instructions ask for a change in tone, style, or focus, apply it while grounding the content in the sources.
- provide a NEW "thoughtProcess" explaining how you integrated the feedback.

Output Structure (JSON ONLY):
{
  "thoughtProcess": "Explanation of how feedback was applied.",
  "updatedContent": "...", // String for blog/linkedin, Array for twitter, etc.
  "metadata": {} // Any additional metadata like updated title
}
`;

export async function POST(req: Request) {
    try {
        const {
            platform,
            originalContent,
            originalThought,
            knowledgeContext,
            instructions
        } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });

        const localPrompt = `
PLATFORM: ${platform}
ORIGINAL CONTENT:
${typeof originalContent === 'string' ? originalContent : JSON.stringify(originalContent)}

ORIGINAL THOUGHT PROCESS:
${originalThought}

USER INSTRUCTIONS:
${instructions}

KNOWLEDGE CONTEXT:
${JSON.stringify(knowledgeContext, null, 2)}

Please refine the content now.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                { role: "user", parts: [{ text: REFINEMENT_SYSTEM_PROMPT + "\n\n" + localPrompt }] }
            ],
            config: {
                responseMimeType: "application/json",
                temperature: 0.2
            }
        });

        if (!response.text) throw new Error("Failed to generate refined content");
        const result = JSON.parse(response.text);

        // If it's an image, we need to actually generate the image too
        if (platform === 'image') {
            console.log("Refining Image: Generating new masterpiece...");
            const visualPrompt = result.updatedContent;
            let imageBase64 = "";

            try {
                // Phase 2: Native Image Generation (Same logic as image route)
                const imageResponse = await (ai.models as any).generateContent({
                    model: "gemini-2.5-flash-image",
                    contents: [{ role: "user", parts: [{ text: visualPrompt }] }],
                });

                const candidates = (imageResponse as any).candidates || (imageResponse as any).response?.candidates;
                if (candidates && candidates[0]?.content?.parts) {
                    for (const part of candidates[0].content.parts) {
                        if (part.inlineData) {
                            imageBase64 = part.inlineData.data;
                            break;
                        }
                    }
                }

                // Fallback to gemini-2.0-flash
                if (!imageBase64) {
                    console.log("Fallback to 2.0-flash for refined image...");
                    const fallbackResponse = await (ai.models as any).generateContent({
                        model: "gemini-2.0-flash",
                        contents: [{ role: "user", parts: [{ text: `Generate an image for: ${visualPrompt}` }] }],
                    });
                    const fallbackCandidates = (fallbackResponse as any).candidates || (fallbackResponse as any).response?.candidates;
                    if (fallbackCandidates && fallbackCandidates[0]?.content?.parts) {
                        for (const part of fallbackCandidates[0].content.parts) {
                            if (part.inlineData) {
                                imageBase64 = part.inlineData.data;
                                break;
                            }
                        }
                    }
                }

                if (imageBase64) {
                    result.imageBase64 = imageBase64;
                }
            } catch (imgError) {
                console.error("Refinement Image Generation Error:", imgError);
                // Attempt imagen-3 fallback if available
                try {
                    const imgModels = ai.models as any;
                    if (imgModels && typeof imgModels.generateImages === 'function') {
                        const res = await imgModels.generateImages({
                            model: "imagen-3.0-generate-001",
                            prompt: visualPrompt,
                            config: { number_of_images: 1 }
                        });
                        const images = res.generatedImages || res.generated_images;
                        if (images?.length > 0) {
                            imageBase64 = images[0].image.data || images[0].image.base64 || "";
                            result.imageBase64 = imageBase64;
                        }
                    }
                } catch (e) {
                    console.error("Final refinement image fallback failed.");
                }
            }
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Refinement Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
