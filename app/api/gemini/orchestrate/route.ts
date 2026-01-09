import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { sources } = await req.json();
        console.log(sources);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        if (!sources || !Array.isArray(sources) || sources.length === 0) {
            return NextResponse.json(
                { error: "At least one source is required" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const orchestratorPrompt = `
                Role: You are a Holistic Intelligence Architect.
                Objective: Your task is to ingest multiple diverse sources (YouTube videos, PDFs, and web articles) and synthesize them into a single, high-density "Knowledge Core."
                
                CRITICAL REQUIREMENT: BALANCED SYNTHESIS.
                - Do not let the video content overshadow the text-based articles or PDFs.
                - Cross-reference every source. If Source A (Video) says X and Source B (Article) says Y, combine them or contrast them.
                - If you are provided with 3 sources, I expect to see specific evidence and insights derived from all 3.
                - This "Knowledge Core" is the ONLY source of truth for downstream agents who will generate Tweets, LinkedIn posts, and Blogs. Provide enough raw data, quotes, and hooks for them to work with.

                Output Format (STRICT JSON ONLY):
                {
                    "metadata": {
                        "project_title": "A compelling title synthesized from all sources",
                        "sources_processed": ["list of URLs or types found"],
                        "overall_narrative": "A 2-sentence summary of the unified message"
                    },
                    "source_analysis": [
                        {
                            "source_index": 0,
                            "key_contribution": "What unique value did this specific source add?",
                            "top_3_points": ["Point 1", "Point 2", "Point 3"]
                        }
                    ],
                    "knowledge_core": {
                        "themes": [
                            {
                                "topic": "Theme name",
                                "details": "Deep explanation synthesized from multiple sources",
                                "source_refs": [0, 1]
                            }
                        ],
                        "gold_nuggets": [
                            {"content": "A powerful quote, stat, or insight", "origin": "Source name/type"}
                        ],
                        "frameworks": ["Named entities, tools, or proprietary methods discovered"]
                    },
                    "social_fuel": {
                        "hooks": {
                            "aggressive": "A controversial or high-stakes hook",
                            "educational": "A value-first 'How-to' hook",
                            "story": "A narrative/personal journey hook"
                        },
                        "visual_brief": "A specific description for an AI image generator that captures the soul of this content"
                    }
                }
                `;

        const parts = [];

        // Add each source with explicit context to ensure the model pays attention to each
        sources.forEach((source: any, index: number) => {
            parts.push({ text: `--- SOURCE ${index} (${source.type.toUpperCase()}) ---` });

            if (source.type === 'youtube') {
                parts.push({
                    fileData: {
                        mimeType: "video/mp4",
                        fileUri: source.url,
                    },
                });
            } else if (source.type === 'pdf' || source.url.toLowerCase().endsWith('.pdf')) {
                parts.push({
                    fileData: {
                        mimeType: "application/pdf",
                        fileUri: source.url,
                    },
                });
            } else {
                parts.push({
                    text: `Analyze this web article in full and extract its core arguments: ${source.url}`
                });
            }
        });

        // Add the orchestrator prompt as the final instruction
        parts.push({ text: "--- FINAL INSTRUCTION ---" });
        parts.push({ text: orchestratorPrompt });

        console.log("Constructed Parts:", JSON.stringify(parts.map(p => p.text ? p.text : "MULTIMODAL_DATA")));

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: parts
                }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Error in Master Orchestrator:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process sources" },
            { status: 500 }
        );
    }
}
