import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SUMMARIZER_SYSTEM_PROMPT = `
Role: You are an Expert Knowledge Synthesizer Agent. Your goal is to compress complex information into high-density summaries while maintaining technical accuracy.
Source Material: You will be provided with a rich "Knowledge Context" containing FULL transcripts, flattened codebases, and deep insights from source agents.

Agent-to-Agent Communication:
You are receiving this data from specialized Extraction Agents. Your task is to:
1. Identify the absolute core concepts across all sources.
2. Formulate a dense but readable summary that highlights the most critical "Alpha" from the data.
3. Show your "Thought Process" - explain which data points you prioritized as "critical" and how you filtered out the noise from the raw sources.
4. Generate the final summary.

Output Structure (JSON ONLY):
{
  "thoughtProcess": "A detailed explanation of how you prioritized specific data points and synthesized the final summary.",
  "summary": "The formatted summary content"
}
`;

export async function POST(req: Request) {
    try {
        const { sources, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });

        const ai = new GoogleGenAI({ apiKey });
        const parts = [
            { text: SUMMARIZER_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nAnalyze the provided Knowledge Context and generate a high-density summary with your internal thought process.` }
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
        console.error("Summarizer Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
