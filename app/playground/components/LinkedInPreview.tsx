import { useEffect, useState } from 'react';

interface LinkedInPreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
    knowledgeCore?: string;
}

export function LinkedInPreview({ draftContent, setDraftContent, knowledgeCore }: LinkedInPreviewProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchLinkedInContent = async () => {
            if (draftContent && draftContent.length > 0) {
                return;
            }

            if (!knowledgeCore) return;

            setIsLoading(true);
            try {
                const res = await fetch('/api/gemini/social', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ knowledgeCore: JSON.parse(knowledgeCore) }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error);

                const parsed = JSON.parse(data.text);
                const post = parsed.linkedin_post;

                setDraftContent(post);
            } catch (error) {
                console.error('Error generating linkedin content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLinkedInContent();
    }, [knowledgeCore]);

    return (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6 flex items-center justify-between">
                LinkedIn Preview
                {isLoading && (
                    <span className="text-sm font-normal text-[#B3B3B3] flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                    </span>
                )}
            </h1>
            <div className="flex-1 flex flex-col bg-[#FFFFFF] p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4D4D4] flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#2B2B2B]">Your Name</span>
                            <span className="text-[#B3B3B3]">·</span>
                            <span className="text-[#B3B3B3]">1st</span>
                        </div>
                        <p className="text-xs text-[#B3B3B3]">Your Title · Your Company</p>
                    </div>
                </div>
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder={isLoading ? "Generating professional story..." : "Share your thoughts..."}
                    className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent mb-4"
                />
                <div className="flex items-center gap-4 pt-4 border-t border-[#D4D4D4] text-[#B3B3B3]">
                    <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-sm">Share</span>
                    </button>
                    <div className="ml-auto text-xs">{draftContent.length} characters</div>
                </div>
            </div>
        </div>
    );
}

