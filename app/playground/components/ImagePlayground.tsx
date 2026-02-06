import { useState } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

function TweetSkeleton({ showLine = false }: { showLine?: boolean }) {
    return (
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm overflow-hidden relative group">
            <div className="flex gap-4 relative">
                {showLine && (
                    <div className="absolute left-[23px] top-12 bottom-[-32px] w-0.5 bg-slate-100/50" />
                )}
                <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0 relative z-10" />
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-24 bg-slate-100 rounded-md" />
                            <div className="h-3 w-32 bg-slate-50 rounded-md" />
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-slate-100" />
                            <div className="w-1 h-1 rounded-full bg-slate-100" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
                        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
                        <div className="h-3.5 w-4/5 bg-slate-50 rounded-md" />
                    </div>
                    <div className="pt-2 flex gap-6">
                        <div className="h-3 w-8 bg-slate-50 rounded-md" />
                        <div className="h-3 w-8 bg-slate-50 rounded-md" />
                        <div className="h-3 w-8 bg-slate-50 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ImagePlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    thoughts: Thought[];
    setThoughts: (thoughts: Thought[]) => void;
    knowledgeContext?: any;
    isProcessing?: boolean;
}

export function ImagePlayground({
    sources,
    draftContent,
    setDraftContent,
    thoughts,
    setThoughts,
    knowledgeContext,
    isProcessing = false
}: ImagePlaygroundProps) {
    const [isLoadingLocally, setIsLoadingLocally] = useState(false);
    const projectName = knowledgeContext?.projectName || "UNTITLED PROJECT";
    const activeLoading = isProcessing || isLoadingLocally;

    const handleGeneratePrompt = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoadingLocally(true);
        try {
            const res = await fetch('/api/gemini/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sources,
                    knowledgeContext
                }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.visual_prompt);

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
            <div className="flex items-center justify-between shrink-0 mb-4 bg-purple-50/30 p-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">Visual Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">Active Project</span>
                        <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight truncate max-w-[200px]">{projectName}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Agent Thought Process History */}
                <div className="col-span-5 flex flex-col overflow-hidden">
                    <ThoughtHistory
                        thoughts={thoughts}
                        isLoading={activeLoading}
                        accentColor="#9333EA"
                        emptyIcon="🎨"
                    />
                </div>

                {/* Right: Canvas */}
                <div className="col-span-7 flex flex-col h-full">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 px-2 shrink-0">Visual Brief Preview</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">

                        {!draftContent && !activeLoading && (
                            <div className="relative">
                                <div className="space-y-4 opacity-[0.3] pointer-events-none select-none">
                                    <TweetSkeleton showLine={true} />
                                    <TweetSkeleton showLine={true} />
                                    <TweetSkeleton />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                                    <div className="bg-white/95 px-8 py-6">
                                        <button
                                            onClick={handleGeneratePrompt}
                                            disabled={activeLoading || sources.length === 0}
                                            className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-sm shadow-lg shadow-black/30 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Generate Graphics</span>
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                                            {sources.length === 0 ? 'Add sources to get started' : 'Click to generate your thread'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeLoading && !draftContent && (
                            <div className="space-y-4 animate-pulse">
                                <TweetSkeleton showLine={true} />
                                <TweetSkeleton showLine={true} />
                                <TweetSkeleton />
                            </div>
                        )}

                        {draftContent && (
                            <div className="bg-white rounded-[32px] overflow-hidden">
                                <div className="p-12 text-center">
                                    <div className="w-full aspect-video bg-slate-50 rounded-[24px] flex items-center justify-center border-2 border-dashed border-slate-200 mb-6">
                                        <span className="text-4xl opacity-30">🖼️</span>
                                    </div>
                                    <textarea
                                        value={draftContent}
                                        onChange={(e) => setDraftContent(e.target.value)}
                                        placeholder="Architectural visual brief will generate here..."
                                        className="w-full resize-none border-none outline-none text-[#1A1A1A] text-center text-lg leading-relaxed bg-transparent font-medium min-h-[150px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
