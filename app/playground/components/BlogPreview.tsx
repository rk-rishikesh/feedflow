import { useEffect, useState } from 'react';

interface BlogPreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
    knowledgeCore?: string;
}

export function BlogPreview({ draftContent, setDraftContent, knowledgeCore }: BlogPreviewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('Blog Post Title');

    useEffect(() => {
        const fetchBlogContent = async () => {
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
                setDraftContent(parsed.blog_post || '');
                if (parsed.metadata?.title) {
                    setTitle(parsed.metadata.title);
                }
            } catch (error) {
                console.error('Error generating blog content:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogContent();
    }, [knowledgeCore]);

    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6 flex items-center justify-between">
                Blog Preview
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
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-[#2B2B2B] mb-3">{title}</h2>
                    <div className="flex items-center gap-3 text-sm text-[#B3B3B3]">
                        <span>By Your Name</span>
                        <span>·</span>
                        <span>Published now</span>
                    </div>
                </div>
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Start writing your blog post..."
                    className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent"
                />
                <div className="mt-4 pt-4 border-t border-[#D4D4D4] text-xs text-[#B3B3B3]">
                    {draftContent.length} characters
                </div>
            </div>
        </div>
    );
}
