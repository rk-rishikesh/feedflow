interface BlogPreviewProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
}

export function BlogPreview({ draftContent, setDraftContent }: BlogPreviewProps) {
    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Blog Preview</h1>
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-[#2B2B2B] mb-3">Blog Post Title</h2>
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
