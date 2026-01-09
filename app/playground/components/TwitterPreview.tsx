import { useEffect, useState, useRef } from 'react';

interface TwitterPreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
    knowledgeCore?: string;
}

export function TwitterPreview({ draftContent, setDraftContent, knowledgeCore }: TwitterPreviewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTwitterContent = async () => {
            // If we already have content, don't auto-fetch
            if (draftContent && !draftContent.startsWith('Content creation is important')) {
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

                const responseData = typeof data.text === 'string' ? JSON.parse(data.text) : data.text;
                const thread = Array.isArray(responseData.twitter_thread)
                    ? responseData.twitter_thread.join('\n\n---\n\n')
                    : responseData.twitter_thread;

                setDraftContent(thread);
            } catch (error) {
                console.error('Error generating twitter content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTwitterContent();
    }, [knowledgeCore]);

    // Split content by the separator
    const tweets = draftContent.split(/\n\n---\n\n/).map(t => t.trim()).filter(Boolean);

    const handleTweetChange = (index: number, newText: string) => {
        const newTweets = [...tweets];
        newTweets[index] = newText;
        setDraftContent(newTweets.join('\n\n---\n\n'));
    };

    return (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full h-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6 flex items-center justify-between shrink-0">
                Twitter Thread Preview
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

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto pr-4 space-y-0 relative no-scrollbar scroll-smooth"
            >
                {tweets.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">No tweets generated yet.</p>
                    </div>
                )}

                {tweets.map((tweet, index) => (
                    <div
                        key={index}
                        className="relative flex flex-col pt-4 first:pt-0 last:pb-12"
                    >
                        {/* Thread Line Segment */}
                        {index !== tweets.length - 1 && (
                            <div
                                className={`absolute left-[23px] bottom-0 w-[2px] bg-[#E1E8ED] ${index === 0 ? 'top-[52px]' : 'top-[64px]'
                                    }`}
                            />
                        )}

                        <div className="flex items-start gap-3">
                            {/* Profile Image */}
                            <div className="relative z-10 shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ring-4 ring-white ${index === 0 ? 'bg-gradient-to-br from-[#00BAFF] to-[#0081FB]' : 'bg-[#B2B2B2]'
                                    }`}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center justify-between mb-0.5">
                                    <div className="flex items-center gap-1.5 truncate">
                                        <span className="font-bold text-[#0F1419] text-[15px] truncate">
                                            {index === 0 ? 'Your Name' : 'Name'}
                                        </span>
                                        {index === 0 && (
                                            <svg className="w-[18px] h-[18px] text-[#1D9BF0]" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.5 12.5c0-1.58-.8-2.95-2.03-3.76.54-1.18.63-2.52.19-3.7-.33-.92-1.06-1.65-1.98-1.98-1.18-.44-2.52-.35-3.7.19-.81-1.23-2.18-2.03-3.76-2.03s-2.95.8-3.76 2.03c-1.18-.54-2.52-.63-3.7-.19-.92.33-1.65 1.06-1.98 1.98-.44 1.18-.35 2.52.19 3.7-1.23.81-2.03 2.18-2.03 3.76s.8 2.95 2.03 3.76c-.54 1.18-.63 2.52-.19 3.7.33.92 1.06 1.65 1.98 1.98 1.18.44 2.52.35 3.7-.19.81 1.23 2.18 2.03 3.76 2.03s2.95-.8 3.76-2.03c1.18.54 2.52.63 3.7.19.92-.33 1.65-1.06 1.98-1.98.44-1.18.35-2.52-.19-3.7 1.23-.81 2.03-2.18 2.03-3.76zm-10.42 4.49l-4.47-4.47 1.41-1.41 3.06 3.06 6.32-6.32 1.41 1.41-7.73 7.73z" />
                                            </svg>
                                        )}
                                        <span className="text-[#536471] text-[15px] truncate">@UserNameHere · 1hr</span>
                                    </div>
                                    <button className="text-[#536471] hover:text-[#1D9BF0] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </button>
                                </div>

                                <textarea
                                    value={tweet}
                                    onChange={(e) => handleTweetChange(index, e.target.value)}
                                    className="w-full p-0 mt-1 resize-none border-none outline-none text-[#0F1419] placeholder-[#536471] text-[15px] leading-normal bg-transparent focus:ring-0 overflow-hidden"
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = target.scrollHeight + 'px';
                                    }}
                                    ref={(el) => {
                                        if (el) {
                                            el.style.height = 'auto';
                                            el.style.height = el.scrollHeight + 'px';
                                        }
                                    }}
                                    spellCheck={false}
                                />

                                <div className="mt-3 flex items-center justify-between text-[#536471] max-w-sm pr-4">
                                    <button className="group flex items-center gap-2 hover:text-[#1D9BF0] transition-colors text-sm">
                                        <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
                                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <span>{index === 0 ? '82k' : '2k'}</span>
                                    </button>

                                    <button className="group flex items-center gap-2 hover:text-[#00BA7C] transition-colors text-sm">
                                        <div className="p-2 rounded-full group-hover:bg-[#00BA7C]/10">
                                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </div>
                                        <span>{index === 0 ? '45k' : '5k'}</span>
                                    </button>

                                    <button className="group flex items-center gap-2 hover:text-[#F91880] transition-colors text-sm">
                                        <div className="p-2 rounded-full group-hover:bg-[#F91880]/10">
                                            <svg
                                                className={`w-[18px] h-[18px] ${index === 0 ? 'text-[#F91880]' : ''}`}
                                                fill={index === 0 ? 'currentColor' : 'none'}
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <span className={index === 0 ? 'text-[#F91880]' : ''}>{index === 0 ? '91k' : '1k'}</span>
                                    </button>

                                    <button className="group flex items-center gap-2 hover:text-[#1D9BF0] transition-colors text-sm">
                                        <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
                                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                        </div>
                                        <span>{index === 0 ? '78k' : '8k'}</span>
                                    </button>

                                    <button className="group flex items-center gap-2 hover:text-[#1D9BF0] transition-colors text-sm">
                                        <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10">
                                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <span>{index === 0 ? '87k' : '17k'}</span>
                                    </button>

                                    <button className="p-2 rounded-full hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] transition-colors">
                                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between items-center px-2 shrink-0 border-t pt-4">
                <div className="text-xs text-[#657786]">
                    {tweets.length} tweets in thread · {draftContent.length} characters total
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setDraftContent(draftContent + '\n\n---\n\nNew tweet...')}
                        className="text-xs px-4 py-2 border border-[#CFD9DE] text-[#0F1419] rounded-full font-bold hover:bg-[#F7F9F9] transition-colors"
                    >
                        + Add Tweet
                    </button>
                    <button
                        className="text-xs px-4 py-2 bg-[#1DA1F2] text-white rounded-full font-bold hover:bg-[#1a91da] transition-colors"
                    >
                        Tweet all
                    </button>
                </div>
            </div>
        </div>
    );
}
