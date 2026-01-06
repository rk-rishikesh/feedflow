import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [{ parts: [{ text: prompt }] }],
        });

        const text = response.text;

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Error creating Gemini text response:", error);
        return NextResponse.json(
            { error: "Failed to generate text" },
            { status: 500 }
        );
    }
}
