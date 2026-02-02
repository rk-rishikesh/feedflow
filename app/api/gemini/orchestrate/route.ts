import { NextResponse } from "next/server";
import { scrapeWebsite, processGithub, processYoutube } from "@/lib/scrapers";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
    try {
        const { sources } = await req.json();

        if (!sources || !Array.isArray(sources) || sources.length === 0) {
            return NextResponse.json(
                { error: "At least one source is required" },
                { status: 400 }
            );
        }

        // 1. Gather raw content from all sources using dedicated scrapers/processors
        const processedSources = await Promise.all(sources.map(async (source) => {
            let content = "";
            let status = "processed";

            switch (source.type) {
                case 'github':
                    content = await processGithub(source.url);
                    break;
                case 'youtube':
                    content = await processYoutube(source.url);
                    break;
                case 'article':
                case 'blog':
                case 'news':
                case 'website':
                    content = await scrapeWebsite(source.url);
                    break;
                default:
                    content = `Unsupported source type: ${source.type}`;
                    status = "error";
            }

            return {
                ...source,
                extractedContent: content,
                processingStatus: status
            };
        }));

        // 2. Synthesize everything into a "Unified Knowledge Context" using Gemini
        // This makes the downstream generation much easier as they don't have to parse raw scrapings
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                sources: processedSources,
                warning: "Knowledge synthesis skipped (No API key)"
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        const synthesisPrompt = `
            You are a Knowledge Architect. Ingest the following raw extracted content from multiple tools and synthesize it into a single, structured Knowledge Context.
            
            EXTRACTED DATA:
            ${processedSources.map((s, i) => `--- SOURCE ${i} (${s.type}) ---\n${s.extractedContent.slice(0, 5000)}`).join('\n\n')}
            
            Synthesize this into a structured JSON with:
            1. Core Narrative (What is the unified story?)
            2. Key Technical Concepts (Extract spec names, tools, architectures)
            3. Unique Insights (Nuggets of wisdom, surprising stats)
            4. Potential Hooks (Aggressive, Professional, Story-based)
            5. Content Pillars (3-4 main categories of information)
            
            STRICT JSON OUTPUT ONLY.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: synthesisPrompt }] }],
            config: {
                responseMimeType: "application/json",
            }
        });

        if (!response.text) {
            throw new Error("Gemini failed to generate synthesized knowledge.");
        }

        const synthesisData = JSON.parse(response.text);

        return NextResponse.json({
            sources: processedSources,
            knowledgeContext: synthesisData
        });

    } catch (error: any) {
        console.error("Error in Data Orchestrator:", error);
        return NextResponse.json(
            { error: error.message || "Failed to aggregate sources" },
            { status: 500 }
        );
    }
}
