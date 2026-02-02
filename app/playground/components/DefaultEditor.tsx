import Image from 'next/image';

interface DefaultEditorProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
}

export function DefaultEditor({ draftContent, setDraftContent }: DefaultEditorProps) {
    if (!draftContent) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="relative w-64 h-64 mb-8">
                    <Image
                        src="/assets/characters/one.svg"
                        alt="Agent Mascot"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h2 className="text-3xl font-black text-[#1A1A1A] mb-4 tracking-tight">Ready to Engineer?</h2>
                <p className="text-[#888888] max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                    Add your sources on the right—videos, docs, or repos—and let my specialized agents craft your masterpiece.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4D4D4] uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-[#E5E5E5]" />
                    Feed Flow Studio
                    <span className="w-8 h-[1px] bg-[#E5E5E5]" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Master Draft</h1>
                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-widest bg-[#F5F5F5] px-3 py-1 rounded-full">
                    {draftContent.length} characters
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#E5E5E5] rounded-[32px] overflow-hidden shadow-sm p-8">
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Start writing..."
                    className="flex-1 w-full resize-none border-none outline-none text-[#1A1A1A] placeholder-[#B3B3B3] text-lg leading-relaxed bg-transparent font-medium"
                />
            </div>
        </div>
    );
}
