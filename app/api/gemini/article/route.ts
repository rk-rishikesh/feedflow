import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ARTICLE_SYSTEM_PROMPT = `
Role: You are a Master Content Architect Agent. Your goal is to transform multiple source outputs into a high-authority, long-form article.
Source Material: You will be provided with a rich "Knowledge Context" containing FULL transcripts, flattened codebases, and deep insights from source agents.

Agent-to-Agent Communication:
You are receiving this data from specialized Extraction Agents. Your task is to:
1. Synthesize the technical depth of all sources into a cohesive narrative.
2. Formulate a structure that flows logically from data to insight.
3. Show your "Thought Process" - explain how you combined the different sources, why you chose specific technical details to include, and how you architected the article's flow.
4. Generate the final article.

Output Structure (JSON ONLY):
{
  "thoughtProcess": "A detailed explanation of your architectural decisions and how you synthesized multiple data streams into a single narrative.",
  "metadata": {
    "title": "A compelling title suited for the content depth",
    "reading_time": "Estimated mins",
    "target_audience": "Description",
    "tone_analysis": "Brief description of the generated tone"
  },
  "article_body": "Full markdown content here",
  "key_takeaways": ["Point 1", "Point 2"]
}
`;

export async function POST(req: Request) {
    try {
        const { sources, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const parts = [
            { text: ARTICLE_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nAnalyze the provided Knowledge Context and architect a comprehensive article with your internal thought process.` }
        ];

        if (knowledgeContext) {
            parts.push({
                text: `--- KNOWLEDGE CONTEXT FROM SOURCE AGENTS ---\n${JSON.stringify(knowledgeContext, null, 2)}`
            });
        } else {
            sources.forEach((source: any, index: number) => {
                parts.push({ text: `--- SOURCE ${index} (${source.type.toUpperCase()}) --- \n${source.url}` });
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts }],
            config: {
                responseMimeType: "application/json",
            }
        });

        if (!response.text) throw new Error("Failed to generate content");
        return NextResponse.json({ text: response.text });

    } catch (error: any) {
        console.error("Error in Specialized Article Agent:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate article" },
            { status: 500 }
        );
    }
}
