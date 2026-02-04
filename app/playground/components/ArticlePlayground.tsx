import { useState, useEffect } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

interface ArticlePlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    title: string;
    setTitle: (title: string) => void;
    metadata: any;
    setMetadata: (metadata: any) => void;
    thoughts: Thought[];
    setThoughts: (thoughts: Thought[]) => void;
    knowledgeContext?: any;
    isProcessing?: boolean;
}

export function ArticlePlayground({
    sources,
    draftContent,
    setDraftContent,
    title,
    setTitle,
    metadata,
    setMetadata,
    thoughts,
    setThoughts,
    knowledgeContext,
    isProcessing = false
}: ArticlePlaygroundProps) {
    const [isLoadingLocally, setIsLoadingLocally] = useState(false);
    const projectName = knowledgeContext?.projectName || "UNTITLED PROJECT";
    const activeLoading = isProcessing || isLoadingLocally;

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoadingLocally(true);
        try {
            const res = await fetch('/api/gemini/article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, knowledgeContext }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.article_body);
            setTitle(parsed.metadata.title);
            setMetadata(parsed.metadata);

            const newThought: Thought = {
                id: Date.now().toString(),
                type: 'initial',
                text: parsed.thoughtProcess || '',
                timestamp: new Date().toISOString()
            };
            setThoughts([newThought]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingLocally(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-8 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded-md uppercase tracking-wider">Project</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{projectName}</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">ARTICLE STUDIO</h1>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={activeLoading || sources.length === 0}
                    className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {activeLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Architecting Article...
                        </>
                    ) : 'Commence Drafting'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Agent Thought Process History */}
                <div className="col-span-4 flex flex-col overflow-hidden">
                    <ThoughtHistory
                        thoughts={thoughts}
                        isLoading={activeLoading}
                        accentColor="#1A1A1A"
                        emptyIcon="📜"
                    />
                </div>

                {/* Right: Preview */}
                <div className="col-span-8 flex flex-col bg-[#FFFFFF] rounded-[32px] overflow-hidden relative">
                    <div className="p-12 overflow-y-auto custom-scrollbar flex-1">
                        {metadata && (
                            <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-widest text-[#888888]">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    TIME: {metadata.reading_time}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    TARGET: {metadata.target_audience}
                                </span>
                            </div>
                        )}
                        <h2 className="text-5xl font-black text-[#1A1A1A] mb-10 leading-[1.1] tracking-tight">
                            {title || "Architected article will generate here..."}
                        </h2>
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Drafting your masterpiece based on agent-to-agent data flow..."
                            className="w-full h-full resize-none border-none outline-none text-[#1A1A1A] placeholder-[#D4D4D4] text-xl leading-relaxed bg-transparent font-medium"
                        />
                    </div>

                    {draftContent && (
                        <div className="p-6 bg-[#F9F9F9] flex justify-between items-center shrink-0">
                            <div className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">
                                {draftContent.split(' ').length} WORDS · {draftContent.length} CHARS
                            </div>
                            <div className="flex gap-3">
                                <button className="px-6 py-2 bg-white border border-[#E5E5E5] rounded-full text-xs font-bold hover:bg-[#F5F5F5] transition-all">Copy Markdown</button>
                                <button className="px-6 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-bold hover:shadow-lg transition-all">Publish</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
