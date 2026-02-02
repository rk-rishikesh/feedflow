import { useState } from 'react';
import { Source } from '../types';

interface LinkedInPlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    persona: string;
    setPersona: (persona: string) => void;
    knowledgeContext?: any;
}

export function LinkedInPlayground({
    sources,
    draftContent,
    setDraftContent,
    persona,
    setPersona,
    knowledgeContext
}: LinkedInPlaygroundProps) {
    const [isLoading, setIsLoading] = useState(false);

    const personas = [
        { id: 'thought_leader', label: 'Market Leader', desc: 'Authoritative & Strategic', icon: '🏛️' },
        { id: 'bd_expert', label: 'BD Strategist', desc: 'Growth & Business Value', icon: '🤝' },
        { id: 'storyteller', label: 'Executive Coach', desc: 'Personal & Lessons-Focused', icon: '🗣️' },
        { id: 'tech_evangelist', label: 'Innovation Lead', desc: 'Future-Trends & Tech', icon: '🔮' },
    ];

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoading(true);
        try {
            const res = await fetch('/api/gemini/linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, persona, knowledgeContext }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.linkedin_post);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-8 h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0077B5] to-[#004182]">LINKEDIN STUDIO</h1>
                    <p className="text-sm text-[#888888] font-medium">Drafting high-authority professional content with specialized agents.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || sources.length === 0}
                    className="px-8 py-3 bg-[#0077B5] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Agent is Thinking...' : 'Draft Post'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Personas */}
                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">Select Agent Persona</h3>
                    {personas.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setPersona(p.id)}
                            className={`p-5 rounded-2xl border text-left transition-all ${persona === p.id
                                ? 'bg-[#0077B5] border-[#0077B5] text-white shadow-lg'
                                : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#0077B5]'
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
                <div className="col-span-8 flex flex-col bg-white border border-[#E5E5E5] rounded-[32px] shadow-sm overflow-hidden relative">
                    <div className="p-8 border-b border-[#F5F5F5] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div>
                            <div className="font-bold text-[#1A1A1A] text-sm leading-none mb-1">Your Agent</div>
                            <div className="text-[10px] text-gray-400 font-medium">Persona: {personas.find(p => p.id === persona)?.label}</div>
                        </div>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Professional story starting here..."
                            className="w-full h-full resize-none border-none outline-none text-[#1A1A1A] text-[17px] leading-relaxed bg-transparent font-medium"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E1E8ED; border-radius: 10px; }
            `}</style>
        </div>
    );
}
