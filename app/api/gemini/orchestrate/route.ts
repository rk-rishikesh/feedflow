import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import os from "os";

export const maxDuration = 300; // Increase timeout to 5 minutes for multiple sources

async function processVideoSource(url: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    const videoId = isYoutube ? ytdl.getVideoID(url) : Date.now().toString();
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${videoId}.mp4`);

    console.log(`Downloading video from ${url}...`);

    const writeStream = fs.createWriteStream(tempFilePath);

    if (isYoutube) {
        const stream = ytdl(url, { quality: "lowest", filter: "audioandvideo" });
        await new Promise((resolve, reject) => {
            stream.pipe(writeStream);
            stream.on("end", resolve);
            stream.on("error", reject);
        });
    } else {
        // Generic video download
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch video: ${res.statusText}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(tempFilePath, buffer);
    }

    console.log("Download complete, uploading to Gemini...");

    const uploadResult = await (ai.files as any).uploadFile(tempFilePath, {
        displayName: `Video ${videoId}`,
        mimeType: "video/mp4"
    });

    // Wait for processing
    let file = await ai.files.get({ name: uploadResult.file.name });
    while (file.state === "PROCESSING") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        file = await ai.files.get({ name: uploadResult.file.name });
    }

    // Cleanup local file
    if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
    }

    if (file.state === "FAILED") {
        throw new Error(`Video processing failed for ${url}`);
    }

    return {
        fileData: {
            mimeType: file.mimeType,
            fileUri: file.uri
        },
        fileName: uploadResult.file.name
    };
}

async function processTextSource(url: string) {
    try {
        const isTwitter = url.includes('twitter.com') || url.includes('x.com');
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const html = await res.text();
        // Remove scripts, styles, and extra tags
        const text = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, '')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 15000);

        return { text: `Source Type: ${isTwitter ? 'Twitter' : 'Web Article'}\nURL: ${url}\nContent: ${text}` };
    } catch (error: any) {
        console.error(`Failed to fetch ${url}:`, error);
        return { text: `Source URL: ${url}\nNote: Could not fetch content directly (${error.message}). Please rely on the title or common knowledge if possible.` };
    }
}

export async function POST(req: Request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    const { sources } = await req.json();
    if (!sources || !Array.isArray(sources) || sources.length === 0) {
        return NextResponse.json({ error: "No sources provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const processedParts: any[] = [];
    const filesToDelete: string[] = [];

    try {
        for (const source of sources) {
            // Determine source type based on URL for processing
            const isYoutube = source.url.includes('youtube.com') || source.url.includes('youtu.be');
            const isGenericVideo = source.url.endsWith('.mp4') || source.url.endsWith('.webm');

            if (isYoutube || isGenericVideo) {
                const result = await processVideoSource(source.url, apiKey);
                processedParts.push(result.fileData);
                filesToDelete.push(result.fileName);
            } else {
                const result = await processTextSource(source.url);
                processedParts.push(result);
            }
        }

        const orchestratorPrompt = `
            Role: You are the Master Content Architect and Orchestrator.
            Input: Multiple sources (YouTube videos, articles, tweets, etc.) provided as video files or text snippets.
            Objective: Synthesize all provided information into a single, unified "Knowledge Core." This core must represent the most valuable insights across ALL sources.
            
            Synthesize common themes, identify unique perspectives from each source, and resolve any contradictions by highlighting multiple viewpoints if applicable.

            1. Extraction Guidelines
            - Narrative Arcs: Map the overarching journey across all sources.
            - Gold Nuggets: Extract the most provocative or insightful quotes from ANY of the sources.
            - Data & Entities: Aggregate all key numbers, names, and tools.
            - Visual Brief: Create a cohesive visual aesthetic derived from the collective vibes.

            2. Output Format (STRICT JSON ONLY)
            Return ONLY a valid JSON object.
            {
              "metadata": {
                "title": "Unified Synthesis Title",
                "tone": "Consistent Tone",
                "target_audience": "Aggregated Audience"
              },
              "semantic_core": {
                "key_takeaways": [{"point": "Idea", "supporting_detail": "Synthesis from sources"}],
                "gold_nuggets": [{"quote": "...", "source": "Source Name/URL", "context": "..."}],
                "frameworks_or_entities": {
                  "named_entities": [],
                  "proprietary_methods": []
                }
              },
              "visual_brief": {
                "aesthetic": "...",
                "image_prompts": []
              },
              "content_hooks": {
                "thread_opener": "Viral synthesis hook",
                "linkedin_hook": "Professional synthesis hook"
              }
            }
        `;

        processedParts.push({ text: orchestratorPrompt });

        const response = await (ai as any).models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ role: "user", parts: processedParts }],
            config: { responseMimeType: "application/json" }
        });

        const text = response.text;

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Orchestration error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        // Cleanup uploaded files
        for (const fileName of filesToDelete) {
            try {
                await ai.files.delete({ name: fileName });
            } catch (e) {
                console.error("Failed to delete file:", fileName, e);
            }
        }
    }
}
