import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ARTICLE_SYSTEM_PROMPT = `
Role: You are a Master Content Architect. Your goal is to transform multiple sources into a high-authority, long-form article.
You must synthesize the technical depth of the sources while adhering to a specific "Persona."

Personas:
- MASTER SEO: High structural hierarchy, rich with keywords, focuses on distribution and readability.
- DEEP DEVELOPER: Technical, code-heavy, focuses on architecture, "how it works," and implementation details.
- BUSINESS STRATEGIST: Focuses on high-level impact, ROI, market trends, and value propositions.
- CREATIVE STORYTELLER: Use analogies, personal narrative style, and compelling hooks to make technical topics accessible.

Article Types:
- TECHNICAL: Architecture documentation style.
- GUIDE: How-to format with steps.
- WALKTHROUGH: Deep-dive tutorial.
- INFORMATIVE: Industry analysis/Thought leadership.

Constraint: 
- Use the FULL context of provided sources.
- Return a strictly valid JSON object.
- Formatting must be Markdown-friendly.

Output Structure:
{
  "metadata": {
    "title": "A compelling title suited for the persona",
    "reading_time": "Estimated mins",
    "target_audience": "Description",
    "tone_analysis": "Brief description of the generated tone"
  },
  "article_body": "Full markdown content here",
  "key_takeaways": ["Point 1", "Point 2"]
}
`;

export async function POST(req: Request) {
    try {
        const { sources, articleType, persona, knowledgeContext } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not defined" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const parts = [
            { text: ARTICLE_SYSTEM_PROMPT },
            { text: `--- INSTRUCTION ---\nGenerate a ${articleType.toUpperCase()} article using the ${persona.toUpperCase()} persona.` }
        ];

        if (knowledgeContext) {
            parts.push({
                text: `--- KNOWLEDGE CONTEXT (SYNTHESIZED FROM SOURCES) ---\n${JSON.stringify(knowledgeContext, null, 2)}`
            });
        } else {
            // Add each source manually if no context provided (fallback)
            sources.forEach((source: any, index: number) => {
                parts.push({ text: `--- SOURCE ${index} (${source.type.toUpperCase()}) ---` });

                if (source.type === 'youtube') {
                    parts.push({
                        fileData: {
                            mimeType: "video/mp4",
                            fileUri: source.url,
                        },
                    } as any);
                } else {
                    parts.push({
                        text: `Analyze this content: ${source.url}`
                    });
                }
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts }],
            config: {
                responseMimeType: "application/json",
            }
        });

        return NextResponse.json({ text: response.text });

    } catch (error: any) {
        console.error("Error in Specialized Article Agent:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate article" },
            { status: 500 }
        );
    }
}
