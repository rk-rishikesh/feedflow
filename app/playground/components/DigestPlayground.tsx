import { useState } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

interface DigestPlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    thoughts: Thought[];
    setThoughts: (thoughts: Thought[]) => void;
    knowledgeContext?: any;
    isProcessing?: boolean;
}

export function DigestPlayground({
    sources,
    draftContent,
    setDraftContent,
    thoughts,
    setThoughts,
    knowledgeContext,
    isProcessing = false
}: DigestPlaygroundProps) {
    const [isLoadingLocally, setIsLoadingLocally] = useState(false);
    const projectName = knowledgeContext?.projectName || "UNTITLED PROJECT";
    const activeLoading = isProcessing || isLoadingLocally;

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoadingLocally(true);
        try {
            const res = await fetch('/api/gemini/summarizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sources,
                    knowledgeContext
                }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.summary);

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
            <div className="flex items-center justify-between shrink-0 mb-4 bg-emerald-50/30 p-4 rounded-[24px] border border-emerald-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">Digest Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Active Project</span>
                        <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight truncate max-w-[200px]">{projectName}</h3>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={activeLoading || sources.length === 0}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {activeLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                        <span>{activeLoading ? 'Synthesizing...' : 'Generate Digest'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Agent Thought Process History */}
                <div className="col-span-5 flex flex-col overflow-hidden">
                    <ThoughtHistory
                        thoughts={thoughts}
                        isLoading={activeLoading}
                        accentColor="#059669"
                        emptyIcon="📊"
                    />
                </div>

                {/* Right: Content */}
                <div className="col-span-7 flex flex-col bg-white rounded-[32px] overflow-hidden relative">
                    <div className="p-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-sm">📉</span>
                        </div>
                        <div>
                            <div className="font-bold text-[#1A1A1A] text-sm leading-none mb-1">Summarizer Agent</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Density Level: Maximum</div>
                        </div>
                    </div>
                    <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Your high-density condensed brief will appear here after the agent completes its handshake..."
                            className="w-full h-full resize-none border-none outline-none text-[#1A1A1A] text-lg leading-relaxed bg-transparent font-medium"
                        />
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
