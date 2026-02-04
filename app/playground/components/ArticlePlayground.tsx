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
            <div className="flex items-center justify-between shrink-0 mb-4 bg-gray-100/50 p-4 rounded-[24px] border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">Article Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest mb-0.5">Active Project</span>
                        <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight truncate max-w-[200px]">{projectName}</h3>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={activeLoading || sources.length === 0}
                        className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-xl font-bold text-xs shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {activeLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                        <span>{activeLoading ? 'Architecting...' : 'Commence Drafting'}</span>
                    </button>
                </div>
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
