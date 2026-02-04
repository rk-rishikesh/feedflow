import { useState } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

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

    return (
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-8 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0 mb-4 bg-gray-50/50 p-4 rounded-[24px]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1DA1F2] text-white flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">Twitter Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">System Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[#1DA1F2] uppercase tracking-widest mb-0.5">Active Project</span>
                        <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight truncate max-w-[200px]">{projectName}</h3>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={activeLoading || sources.length === 0}
                        className="px-6 py-2.5 bg-[#1DA1F2] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#1DA1F2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {activeLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                        <span>{activeLoading ? 'Processing...' : 'Generate Thread'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Agent Thought Process History */}
                <div className="col-span-5 flex flex-col overflow-hidden">
                    <ThoughtHistory
                        thoughts={thoughts}
                        isLoading={activeLoading}
                        accentColor="#1DA1F2"
                    />
                </div>

                {/* Right: Preview */}
                <div className="col-span-7 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2 px-2">Final Output Thread</h3>
                    {tweets.length === 0 && !activeLoading && (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-[#E5E5E5] rounded-[40px] bg-gray-50 p-12 text-center text-gray-400">
                            The agent's output will materialize here.
                        </div>
                    )}

                    {activeLoading && tweets.length === 0 && (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-50 border border-gray-100 rounded-[32px] p-6 h-32" />
                            ))}
                        </div>
                    )}

                    {tweets.map((tweet, idx) => (
                        <div key={idx} className="bg-white rounded-[32px] p-6 transition-all relative">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0081FB] shrink-0" />
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

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
