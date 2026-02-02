import { useState, useEffect } from 'react';
import { Source } from '../types';

interface ArticlePlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    title: string;
    setTitle: (title: string) => void;
    metadata: any;
    setMetadata: (metadata: any) => void;
    persona: string;
    setPersona: (persona: string) => void;
    articleType: string;
    setArticleType: (type: string) => void;
    knowledgeContext?: any;
}

export function ArticlePlayground({
    sources,
    draftContent,
    setDraftContent,
    title,
    setTitle,
    metadata,
    setMetadata,
    persona,
    setPersona,
    articleType,
    setArticleType,
    knowledgeContext
}: ArticlePlaygroundProps) {
    const [isLoading, setIsLoading] = useState(false);

    const personas = [
        { id: 'master_seo', label: 'SEO Master', desc: 'Keywords & Structure', icon: '📈' },
        { id: 'deep_developer', label: 'Deep Dev', desc: 'Architecture & Code', icon: '💻' },
        { id: 'business_strategist', label: 'Strategist', desc: 'ROI & Impact', icon: '👔' },
        { id: 'creative_storyteller', label: 'Storyteller', desc: 'Narrative & Hook', icon: '🎭' },
    ];

    const types = [
        { id: 'technical', label: 'Technical' },
        { id: 'guide', label: 'Guide' },
        { id: 'walkthrough', label: 'Walkthrough' },
        { id: 'informative', label: 'Informative' },
    ];

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoading(true);
        try {
            const res = await fetch('/api/gemini/article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources, articleType, persona, knowledgeContext }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.article_body);
            setTitle(parsed.metadata.title);
            setMetadata(parsed.metadata);
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
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">ARTICLE STUDIO</h1>
                    <p className="text-sm text-[#888888] font-medium">Crafting deep-dive narratives with specialized agents.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || sources.length === 0}
                    className="px-8 py-3 bg-[#1A1A1A] text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? 'Agent is writing...' : 'Draft Article'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Controls */}
                <div className="col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-4">Choose Agent Persona</h3>
                        <div className="flex flex-col gap-3">
                            {personas.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setPersona(p.id)}
                                    className={`p-4 rounded-2xl border text-left transition-all ${persona === p.id
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xl scale-105'
                                        : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#1A1A1A]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{p.icon}</span>
                                        <span className="font-bold text-sm">{p.label}</span>
                                    </div>
                                    <p className={`text-[10px] leading-tight ${persona === p.id ? 'text-gray-400' : 'text-gray-500'}`}>{p.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-4">Article Format</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {types.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setArticleType(t.id)}
                                    className={`px-3 py-2 rounded-xl border text-[10px] font-bold transition-all ${articleType === t.id
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                        : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-black'
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="col-span-8 flex flex-col bg-[#FFFFFF] border border-[#E5E5E5] rounded-[32px] shadow-2xl overflow-hidden relative border-opacity-50">
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
                        <h2 className="text-5xl font-black text-[#1A1A1A] mb-10 leading-[1.1] tracking-tight">{title || "Select an agent and click draft..."}</h2>
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Drafting your masterpiece..."
                            className="w-full h-full resize-none border-none outline-none text-[#1A1A1A] placeholder-[#D4D4D4] text-xl leading-relaxed bg-transparent font-medium"
                        />
                    </div>

                    {draftContent && (
                        <div className="p-6 bg-[#F9F9F9] border-t border-[#E5E5E5] flex justify-between items-center shrink-0">
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
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
            `}</style>
        </div>
    );
}
