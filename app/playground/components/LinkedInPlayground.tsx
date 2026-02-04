import { useState } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

interface LinkedInPlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    thoughts: Thought[];
    setThoughts: (thoughts: Thought[]) => void;
    knowledgeContext?: any;
    isProcessing?: boolean;
}

export function LinkedInPlayground({
    sources,
    draftContent,
    setDraftContent,
    thoughts,
    setThoughts,
    knowledgeContext,
    isProcessing = false
}: LinkedInPlaygroundProps) {
    const [isLoadingLocally, setIsLoadingLocally] = useState(false);
    const projectName = knowledgeContext?.projectName || "UNTITLED PROJECT";
    const activeLoading = isProcessing || isLoadingLocally;

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoadingLocally(true);
        try {
            const res = await fetch('/api/gemini/linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, knowledgeContext }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.linkedin_post);

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
            <div className="flex items-center justify-between shrink-0 mb-4 bg-blue-50/30 p-4 rounded-[24px] border border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0077B5] text-white flex items-center justify-center shadow-lg shadow-[#0077B5]/20">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">LinkedIn Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[#0077B5] uppercase tracking-widest mb-0.5">Active Project</span>
                        <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight truncate max-w-[200px]">{projectName}</h3>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={activeLoading || sources.length === 0}
                        className="px-6 py-2.5 bg-[#0077B5] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#0077B5]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {activeLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                        <span>{activeLoading ? 'Analyzing...' : 'Generate Executive Post'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Agent Thought Process History */}
                <div className="col-span-5 flex flex-col overflow-hidden">
                    <ThoughtHistory
                        thoughts={thoughts}
                        isLoading={activeLoading}
                        accentColor="#0077B5"
                        emptyIcon="👔"
                    />
                </div>

                {/* Right: Preview */}
                <div className="col-span-7 flex flex-col bg-white rounded-[32px] overflow-hidden relative">
                    <div className="p-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <span className="text-xl">💼</span>
                        </div>
                        <div>
                            <div className="font-bold text-[#1A1A1A] text-sm leading-none mb-1">Professional Agent</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">High Fidelity Strategy Agent</div>
                        </div>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Final LinkedIn post will generate here based on the thought process..."
                            className="w-full h-full resize-none border-none outline-none text-[#1A1A1A] text-[17px] leading-relaxed bg-transparent font-medium"
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
