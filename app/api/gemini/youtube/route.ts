import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { url, prompt } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        if (!url) {
            return NextResponse.json(
                { error: "YouTube URL is required" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const orchestratorPrompt = `
                Role: You are the Lead Content Strategist and Semantic Architect.
                Input: A raw video/transcript from a YouTube URL.
                Objective: Deconstruct the video into its fundamental "Knowledge Core." This core will be used by downstream agents to create Tweets, LinkedIn posts, Blogs, and Images.

                1. Extraction Guidelines
                Narrative Arcs: Identify the 3-5 main "acts" or chapters of the video.
                Gold Nuggets: Extract exact quotes that are provocative, counter-intuitive, or highly emotional.
                Data & Entities: Capture all specific numbers, names of people/tools, and unique frameworks mentioned.
                Visual Cues: Describe the visual "vibe" and specific scenes that would make compelling social media images or thumbnails.

                2. Output Format (STRICT JSON ONLY)
                Return only a valid JSON object. Do not include prose, intro text, or markdown formatting outside the JSON block.
                JSON Structure:
                {
                "metadata": {
                    "title": "Extracted Title",
                    "tone": "e.g., Authoritative, Enthusiastic, Controversial",
                    "target_audience": "e.g., SaaS Founders, Personal Growth Enthusiasts"
                },
                "semantic_core": {
                    "key_takeaways": [
                    {"point": "Main Idea", "supporting_detail": "Explanation from video"}
                    ],
                    "gold_nuggets": [
                    {"quote": "Direct quote here", "context": "Why this matters"}
                    ],
                    "frameworks_or_entities": {
                    "named_entities": ["Person A", "Tool B", "Company C"],
                    "proprietary_methods": ["The XYZ Method", "3-Step Growth Framework"]
                    }
                },
                "visual_brief": {
                    "aesthetic": "e.g., Minimalist tech, vibrant energetic, dark/moody studio",
                    "image_prompts": [
                    "A high-quality image of [Subject] doing [Action] in [Setting], cinematic lighting."
                    ]
                },
                "content_hooks": {
                    "thread_opener": "The most controversial hook extracted from the video.",
                    "linkedin_hook": "The professional/business-value hook."
                }
                }
                `;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [
                {
                    fileData: {
                        fileUri: url,
                    },
                },
                { text: orchestratorPrompt }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Error in YouTube direct summary:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process video" },
            { status: 500 }
        );
    }
}
