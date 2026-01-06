interface DefaultEditorProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
}

export function DefaultEditor({ draftContent, setDraftContent }: DefaultEditorProps) {
    return (
        <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Write Post</h1>
            <div className="flex-1 flex flex-col bg-[#FFFFFF]">
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Start writing..."
                    className="flex-1 w-full p-6 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed"
                />
            </div>
            <div className="flex items-center justify-between text-sm text-[#B3B3B3] mt-4">
                <span>{draftContent.length} characters</span>
            </div>
        </div>
    );
}
