import { useState } from 'react';
import { Source } from '../types';

interface TwitterPlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    persona: string;
    setPersona: (persona: string) => void;
    knowledgeContext?: any;
}

export function TwitterPlayground({
    sources,
    draftContent,
    setDraftContent,
    persona,
    setPersona,
    knowledgeContext
}: TwitterPlaygroundProps) {
    const [isLoading, setIsLoading] = useState(false);

    const personas = [
        { id: 'viral_hooks', label: 'Growth Hacker', desc: 'Aggressive & Viral Hooks', icon: '🚀' },
        { id: 'thought_leader', label: 'Thought Leader', desc: 'Authoritative & Concise', icon: '🧠' },
        { id: 'storyteller', label: 'Storyteller', desc: 'Narrative & Personal', icon: '📖' },
        { id: 'tech_evangelist', label: 'Evangelist', desc: 'Hype & Innovation', icon: '⚡' },
    ];

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoading(true);
        try {
            const res = await fetch('/api/gemini/twitter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, persona, knowledgeContext }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            const formattedThread = parsed.twitter_thread.join('\n\n---\n\n');
            setDraftContent(formattedThread);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const tweets = draftContent.split(/\n\n---\n\n/).map(t => t.trim()).filter(Boolean);

    return (
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-8 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#1DA1F2] to-[#0081FB]">TWITTER ENGINE</h1>
                    <p className="text-sm text-[#888888] font-medium">Engineering high-engagement threads from multiple sources.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || sources.length === 0}
                    className="px-8 py-3 bg-[#1DA1F2] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Agent is Hooking...' : 'Generate Thread'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Personas */}
                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">Agent Personality</h3>
                    {personas.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setPersona(p.id)}
                            className={`p-5 rounded-2xl border text-left transition-all ${persona === p.id
                                ? 'bg-[#1DA1F2] border-[#1DA1F2] text-white shadow-lg'
                                : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#1DA1F2]'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xl">{p.icon}</span>
                                <span className="font-bold text-base">{p.label}</span>
                            </div>
                            <p className={`text-[11px] font-medium leading-relaxed ${persona === p.id ? 'text-blue-100' : 'text-gray-500'}`}>{p.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Right: Preview */}
                <div className="col-span-8 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                    {tweets.length === 0 && !isLoading && (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-[#E5E5E5] rounded-[40px] bg-gray-50 p-12 text-center text-gray-400">
                            Select a persona and click generate to see the magic happen.
                        </div>
                    )}

                    {tweets.map((tweet, idx) => (
                        <div key={idx} className="bg-white border border-[#E5E5E5] rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow relative">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0081FB] shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#1A1A1A]">Your Agent</span>
                                        <span className="text-gray-400 text-sm">@agent_dev · {idx + 1}/{tweets.length}</span>
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #CFD9DE; border-radius: 10px; }
            `}</style>
        </div>
    );
}
