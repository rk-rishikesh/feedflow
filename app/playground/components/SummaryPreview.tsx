import { useEffect } from 'react';

interface SummaryPreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
}

export function SummaryPreview({ draftContent, setDraftContent }: SummaryPreviewProps) {
    useEffect(() => {
        const stored = localStorage.getItem('generated_content');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setDraftContent(JSON.stringify(parsed, null, 2));
            } catch (e) {
                setDraftContent(stored);
            }
        }
    }, [setDraftContent]);

    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Summary Preview</h1>
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg className="w-8 h-8 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-[#2B2B2B]">Content Summary</h2>
                    </div>
                </div>
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Your summary will appear here..."
                    className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent font-mono text-sm"
                />
                <div className="mt-4 pt-4 border-t border-[#D4D4D4] text-xs text-[#B3B3B3]">
                    {draftContent.length} characters
                </div>
            </div>
        </div>
    );
}
