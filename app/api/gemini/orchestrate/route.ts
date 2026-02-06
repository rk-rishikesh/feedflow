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

        // 1. Gather rich content from all sources using specialized source agents
        const processedSources = await Promise.all(sources.map(async (source) => {
            let data: any = null;
            let status = "processed";

            console.log(`Orchestrator: Processing ${source.type} - ${source.url}`);

            try {
                switch (source.type) {
                    case 'github':
                        data = await processGithub(source.url);
                        break;
                    case 'youtube':
                        data = await processYoutube(source.url);
                        break;
                    case 'article':
                    case 'blog':
                    case 'news':
                    case 'website':
                        data = await scrapeWebsite(source.url);
                        break;
                    case 'text':
                        data = { text: source.content || source.description || "" };
                        break;
                    default:
                        data = { error: `Unsupported source type: ${source.type}` };
                        status = "error";
                }
            } catch (err) {
                console.error(`Orchestrator error for ${source.url}:`, err);
                status = "error";
                data = { error: "Processing failed" };
            }

            return {
                ...source,
                data,
                processingStatus: status
            };
        }));

        // 2. Generate a Project Name using Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        let projectName = "Untitled Project";

        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            const namingPrompt = `
                Based on the following source titles and snippets, generate a concise, high-impact Project Name (2-4 words) that captures the core essence of this research/content collection.
                
                SOURCES:
                ${processedSources.map(s => `- [${s.type.toUpperCase()}] ${s.title || s.url}`).join('\n')}
                
                REQUIREMENT: Use Title Case (e.g., "The Future of AI"). Do not use all caps or all lowercase.
                Respond with ONLY the project name.
            `;

            try {
                const result = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: [{ role: "user", parts: [{ text: namingPrompt }] }],
                });
                if (result.text) projectName = result.text.trim().replace(/["]+/g, '');
            } catch (nErr) {
                console.error("Naming error:", nErr);
            }
        }

        // 3. Aggregate everything into a Unified Knowledge Context
        const knowledgeContext = {
            projectName,
            sources: processedSources,
            timestamp: new Date().toISOString(),
            totalSources: processedSources.length
        };

        return NextResponse.json({
            projectName,
            sources: processedSources,
            knowledgeContext: knowledgeContext
        });

    } catch (error: any) {
        console.error("Error in Data Orchestrator:", error);
        return NextResponse.json(
            { error: error.message || "Failed to aggregate sources" },
            { status: 500 }
        );
    }
}
