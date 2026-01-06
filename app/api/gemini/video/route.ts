import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import os from "os";

export const maxDuration = 60; // Allow longer timeout for video processing

export async function POST(req: Request) {
    let tempFilePath = "";
    let uploadResult: any = null;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const { url, prompt } = await req.json();

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

        // 1. Download Video
        const videoId = ytdl.getVideoID(url);
        const tempDir = os.tmpdir();
        tempFilePath = path.join(tempDir, `${videoId}.mp4`);

        console.log("Downloading video...", url);

        const writeStream = fs.createWriteStream(tempFilePath);

        // Use 'lowest' quality to save bandwidth/time, usually sufficient for valid summary
        const stream = ytdl(url, { quality: "lowest", filter: "audioandvideo" });

        await new Promise((resolve, reject) => {
            stream.pipe(writeStream);
            stream.on("end", resolve);
            stream.on("error", reject);
        });

        console.log("Download complete, uploading to Gemini...");

        // 2. Upload to Gemini
        uploadResult = await (ai.files as any).uploadFile(tempFilePath, {
            displayName: `Youtube Video ${videoId}`,
            mimeType: "video/mp4"
        });

        console.log("Upload complete:", uploadResult.file.name);

        // 3. Wait for processing
        let file = await ai.files.get({ name: uploadResult.file.name });
        while (file.state === "PROCESSING") {
            console.log("Processing video...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await ai.files.get({ name: uploadResult.file.name });
        }

        if (file.state === "FAILED") {
            throw new Error("Video processing failed.");
        }

        console.log("Video active. Generating content...");

        // 4. Generate Content
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [
                {
                    parts: [
                        {
                            fileData: {
                                mimeType: file.mimeType,
                                fileUri: file.uri
                            }
                        },
                        { text: prompt || "Summarize this video." }
                    ]
                }
            ]
        });

        const text = response.text;

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Error in video summary:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process video" },
            { status: 500 }
        );
    } finally {
        // Cleanup
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        if (uploadResult && uploadResult.file && uploadResult.file.name) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
                await ai.files.delete({ name: uploadResult.file.name });
            } catch (e) {
                console.error("Failed to delete file from Gemini:", e);
            }
        }
    }
}
