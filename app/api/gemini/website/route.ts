import { NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/agents/website";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const data = await analyzeWebsite(url);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Website Source Agent Error:", error);
        return NextResponse.json({ error: error.message || "Failed to analyze website" }, { status: 500 });
    }
}
