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
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-wider">Project</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{projectName}</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#1DA1F2] to-[#0081FB]">TWITTER ENGINE</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={activeLoading || sources.length === 0}
                        className="px-8 py-3 bg-[#1DA1F2] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {activeLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Agent is Processing...
                            </>
                        ) : 'Commence Thread Generation'}
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
