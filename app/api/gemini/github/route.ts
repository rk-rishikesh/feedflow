import { NextResponse } from "next/server";
import { analyzeGithub } from "@/lib/agents/github";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const data = await analyzeGithub(url);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("GitHub Source Agent Error:", error);
        return NextResponse.json({ error: error.message || "Failed to analyze repository" }, { status: 500 });
    }
}
