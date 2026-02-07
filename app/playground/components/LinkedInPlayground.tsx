import { useState } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

function LinkedInPostSkeleton({ showLine = false }: { showLine?: boolean }) {
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
                    <div className="space-y-3">
                        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
                        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
                        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
                        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
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
            <div className="flex items-center justify-between shrink-0 mb-4 bg-blue-50/30 p-4">
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
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
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
                <div className="col-span-7 flex flex-col min-h-0">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 px-2 opacity-50 shrink-0">LinkedIn Post Preview</h3>
                    <div className="flex-1 min-h-0">
                        <div className="max-w-[680px] mx-auto w-full h-full flex flex-col">

                            {!draftContent && !activeLoading && (
                                <div className="relative">
                                    <div className="space-y-4 opacity-[0.3] pointer-events-none select-none">
                                        <LinkedInPostSkeleton showLine={true} />
                                        <LinkedInPostSkeleton showLine={true} />
                                        <LinkedInPostSkeleton />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                                        <div className="bg-white/95 px-8 py-6">
                                            <button
                                                onClick={handleGenerate}
                                                disabled={activeLoading || sources.length === 0}
                                                className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-sm shadow-lg shadow-black/30 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>Generate Post</span>
                                            </button>
                                            <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                                                {sources.length === 0 ? 'Add sources to get started' : 'Click to generate your thread'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeLoading && !draftContent && (
                                <div className="animate-pulse">
                                    <LinkedInPostSkeleton />
                                </div>
                            )}

                            {draftContent && (
                                <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 h-full flex flex-col">
                                    {/* Header - Fixed */}
                                    <div className="p-4 flex justify-between shrink-0 border-b border-gray-100">
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 bg-[#0077B5] rounded-sm flex items-center justify-center text-white shrink-0">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-sm text-gray-900">LinkedIn Agent</span>
                                                    <span className="text-gray-500 text-xs font-normal"> • 1st</span>
                                                </div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px]">Strategic Executive Consultant</div>
                                                <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                                                    <span>Just now • Edited • </span>
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 4.42 3.58 8 8 8 4.42 0 8-3.58 8-8 0-4.42-3.58-8-8-8zM7.5 15C3.86 15 1 12.14 1 8.5h2c0 2.48 2.02 4.5 4.5 4.5v2zM8.5 1h-1v2h1V1zm1.5.5C10 1.5 10.5 2 11 2.5l1.5-1.5L11.5.5 10 1.5z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <svg className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                                            <svg className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                    </div>

                                    {/* Content - Scrollable */}
                                    <div className="px-4 py-4 overflow-y-auto flex-1 custom-scrollbar">
                                        <textarea
                                            value={draftContent}
                                            onChange={(e) => setDraftContent(e.target.value)}
                                            className="w-full resize-none border-none outline-none text-[#1A1A1A] text-sm leading-relaxed bg-transparent min-h-full custom-scrollbar overflow-hidden"
                                            style={{ height: 'auto' }}
                                        />
                                    </div>

                                    {/* Stats - Fixed */}
                                    <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100 shrink-0">
                                        <div className="flex items-center gap-1">
                                            <div className="flex -space-x-1">
                                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-white">
                                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.201 10.302L18 15h-5v5H8v-5H3v-2l2-5h2v2l2 5h1l-2-5h2l2 5h1l-2-5h2l2 5h1l-2-5z" /></svg>
                                                </div>
                                                <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center border border-white text-[8px]">❤️</div>
                                                <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center border border-white text-[8px]">👏</div>
                                            </div>
                                            <span className="text-[11px] text-gray-500">1,204</span>
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            <span>24 comments • 15 reposts</span>
                                        </div>
                                    </div>

                                    {/* Actions - Fixed */}
                                    <div className="px-2 py-1 flex justify-between border-t border-gray-100 shrink-0">
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.708C19.929 10 21 11.071 21 12.292c0 .429-.115.845-.316 1.201l-2.502 4.414A2.342 2.342 0 0116.142 19H8V10l3-7 1 1v6h2zM8 10H5a2 2 0 00-2 2v7a2 2 0 002 2h3V10z" /></svg>
                                            Like
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            Comment
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Repost
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            Send
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                }
                .custom-scrollbar {
                    -ms-overflow-style: none !important;
                    scrollbar-width: none !important;
                }
            `}</style>
        </div>
    );
}
