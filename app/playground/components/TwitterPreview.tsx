import { useEffect, useState } from 'react';

interface TwitterPreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
}

export function TwitterPreview({ draftContent, setDraftContent }: TwitterPreviewProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTwitterContent = async () => {
            const savedTwitter = localStorage.getItem('twitter_content');
            if (savedTwitter) {
                setDraftContent(savedTwitter);
                return;
            }

            const knowledgeCore = localStorage.getItem('generated_content');
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
                const thread = Array.isArray(parsed.twitter_thread)
                    ? parsed.twitter_thread.join('\n\n---\n\n')
                    : parsed.twitter_thread;

                setDraftContent(thread);
                localStorage.setItem('twitter_content', thread);
            } catch (error) {
                console.error('Error generating twitter content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTwitterContent();
    }, [setDraftContent]);

    return (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6 flex items-center justify-between">
                Twitter Preview
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
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4D4D4] flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#2B2B2B]">Your Name</span>
                            <span className="text-[#B3B3B3]">@username</span>
                            <span className="text-[#B3B3B3]">·</span>
                            <span className="text-[#B3B3B3]">now</span>
                        </div>
                    </div>
                </div>
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder={isLoading ? "Generating viral thread..." : "What's happening?"}
                    className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent"
                />
                <div className="mt-4 pt-4 border-t border-[#D4D4D4] flex items-center justify-between text-[#B3B3B3]">
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-xs">{draftContent.length} / 280</div>
                </div>
            </div>
        </div>
    );
}

