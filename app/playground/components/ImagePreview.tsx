import { useEffect } from 'react';

interface ImagePreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
    knowledgeCore?: string;
}

export function ImagePreview({ draftContent, setDraftContent, knowledgeCore }: ImagePreviewProps) {
    useEffect(() => {
        if (draftContent && draftContent.length > 0) return;

        if (knowledgeCore) {
            try {
                const parsed = JSON.parse(knowledgeCore);
                const visualBrief = parsed.visual_brief;
                if (visualBrief && visualBrief.image_prompts && visualBrief.image_prompts.length > 0) {
                    setDraftContent(visualBrief.image_prompts[0]);
                }
            } catch (e) {
                console.error("Failed to parse visual brief", e);
            }
        }
    }, [knowledgeCore, setDraftContent]);
    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Image Preview</h1>
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                    <div className="w-full h-64 bg-[#D4D4D4] rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-16 h-16 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm text-[#B3B3B3] text-center">Image placeholder</p>
                </div>
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Add image caption or description..."
                    className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-sm leading-relaxed bg-transparent"
                />
                <div className="mt-4 pt-4 border-t border-[#D4D4D4] text-xs text-[#B3B3B3]">
                    {draftContent.length} characters
                </div>
            </div>
        </div>
    );
}
