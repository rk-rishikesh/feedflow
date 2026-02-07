import { GoogleGenAI } from "@google/genai";
import ytdl from "@distube/ytdl-core";

export async function analyzeYoutube(url: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");

    console.log("YouTube Agent: Analyzing", url);

    // Fetch video metadata
    let videoTitle = "";
    let videoDescription = "";
    try {
        const info = await ytdl.getBasicInfo(url);
        videoTitle = info.videoDetails.title || "";
        videoDescription = info.videoDetails.description || "";
    } catch (metadataError) {
        console.error("Failed to fetch video metadata:", metadataError);
    }

    // Process with Gemini
    const ai = new GoogleGenAI({ apiKey });
    const extractionPrompt = `
        You are a YouTube Content Analyst. 
        Analyze the following YouTube video and extract the most important information:
        ${videoTitle ? `Title: ${videoTitle}` : ""}
        ${videoDescription ? `Description: ${videoDescription}` : ""}
        URL: ${url}

        TASK:
        1. Using the provided information and the URL, identify the main topic/content.
        2. Extract 5-7 Key Moments or major points covered in the video.
        3. Provide deep insights into the technical/narrative content.
        4. Create a comprehensive technical synthesis/transcript of the content based on the title, description, and metadata.
        5. If you cannot access specific details, provide high-quality general insights based on the video's context.

        Return a STRICT JSON object:
        {
            "title": "Clean, descriptive title of the video",
            "transcript": "A deep-dive technical synthesis of the video content. This should be substantial enough for a knowledge graph node.", 
            "keyMoments": [
                { "time": "MM:SS", "description": "Short description of the moment" }
            ],
            "insights": {
                "summary": "2-3 sentence overview",
                "coreTakeaway": "The fundamental lesson",
                "techStack": ["Relevant technologies if mentioned"]
            }
        }
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: extractionPrompt }] }],
        config: { responseMimeType: "application/json", temperature: 0.1 }
    });

    if (!response.text) throw new Error("Failed to get response from Gemini");
    const aiResult = JSON.parse(response.text);

    return {
        title: aiResult.title || videoTitle || "YouTube Video",
        transcript: aiResult.transcript || aiResult.insights?.summary || "Synthesis provided based on video metadata.",
        keyMoments: aiResult.keyMoments || [],
        insights: aiResult.insights || { summary: aiResult.transcript },
        fullContent: `YouTube Video: ${url}\n\n${aiResult.transcript || aiResult.insights?.summary || ''}`
    };
}
