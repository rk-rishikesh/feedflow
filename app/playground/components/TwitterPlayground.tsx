import { useState, useEffect } from 'react';
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

interface TwitterPlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    thoughts: Thought[];
    setThoughts: (thoughts: Thought[]) => void;
    knowledgeContext?: any;
    isProcessing?: boolean;
}

export function TwitterPlayground({
    sources,
    draftContent,
    setDraftContent,
    thoughts,
    setThoughts,
    knowledgeContext,
    isProcessing = false
}: TwitterPlaygroundProps) {
    const [isGeneratingLocally, setIsGeneratingLocally] = useState(false);
    const projectName = knowledgeContext?.projectName || "UNTITLED PROJECT";
    const activeLoading = isProcessing || isGeneratingLocally;

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsGeneratingLocally(true);
        try {
            const res = await fetch('/api/gemini/twitter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, knowledgeContext }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            const formattedThread = parsed.twitter_thread.join('\n\n---\n\n');
            setDraftContent(formattedThread);

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
            setIsGeneratingLocally(false);
        }
    };

    const tweets = draftContent.split(/\n\n---\n\n/).map(t => t.trim()).filter(Boolean);

    // Auto-resize textareas when tweets change
    useEffect(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }, [tweets]);

    return (
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-8 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0 mb-4 bg-gray-50/50 p-4 rounded-[24px]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-lg shadow-black/20">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">X Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-black uppercase tracking-widest mb-0.5">Active Project</span>
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
                        accentColor="#000000"
                    />
                </div>

                <div className="col-span-7 flex flex-col min-h-0">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 px-2 shrink-0">Final Output Thread</h3>
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                        {tweets.length === 0 && !activeLoading && (
                            <div className="relative">
                                <div className="space-y-4 opacity-[0.3] pointer-events-none select-none">
                                    <TweetSkeleton showLine={true} />
                                    <TweetSkeleton showLine={true} />
                                    <TweetSkeleton />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                                    <div className="bg-white/95 px-8 py-6">
                                        <button
                                            onClick={handleGenerate}
                                            disabled={activeLoading || sources.length === 0}
                                            className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-lg shadow-black/30 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Generate X Thread</span>
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                                            {sources.length === 0 ? 'Add sources to get started' : 'Click to generate your thread'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeLoading && tweets.length === 0 && (
                            <div className="space-y-4 animate-pulse">
                                <TweetSkeleton showLine={true} />
                                <TweetSkeleton showLine={true} />
                                <TweetSkeleton />
                            </div>
                        )}

                        {tweets.map((tweet, idx) => (
                            <div key={idx} className="bg-white rounded-[32px] p-6 transition-all relative">
                                {idx < tweets.length - 1 && (
                                    <div className="absolute left-[47px] top-[72px] bottom-[-24px] w-0.5 bg-gray-100" />
                                )}
                                <div className="flex gap-4 relative z-10">
                                    <div className={`w-12 h-12 rounded-full shrink-0 ${idx === 0 ? 'bg-gradient-to-br from-[#1DA1F2] to-[#0081FB]' : 'bg-gray-100'}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-[#1A1A1A]">X Agent</span>
                                            <span className="text-gray-400 text-sm">@feedflow_ai · {idx + 1}/{tweets.length}</span>
                                        </div>
                                        <textarea
                                            value={tweet}
                                            onChange={(e) => {
                                                const newTweets = [...tweets];
                                                newTweets[idx] = e.target.value;
                                                setDraftContent(newTweets.join('\n\n---\n\n'));
                                            }}
                                            className="w-full h-auto resize-none border-none outline-none text-[#1A1A1A] text-lg leading-snug bg-transparent"
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = target.scrollHeight + 'px';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
