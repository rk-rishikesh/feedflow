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
        return NextResponse.json(JSON.parse(response.text));

    } catch (error: any) {
        console.error("Refinement Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
