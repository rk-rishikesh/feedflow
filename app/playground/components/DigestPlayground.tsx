import { useState } from 'react';
import { Source } from '../types';

interface DigestPlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    knowledgeContext?: any;
}

export function DigestPlayground({
    sources,
    draftContent,
    setDraftContent,
    knowledgeContext
}: DigestPlaygroundProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [digestFormat, setDigestFormat] = useState('executive_summary');

    const formats = [
        { id: 'executive_summary', label: 'Executive Summary', desc: 'High-level bullet points', icon: '📝' },
        { id: 'technical_brief', label: 'Technical Brief', desc: 'Detailed specs & architecture', icon: '⚙️' },
        { id: 'action_items', label: 'Action Items', desc: 'Checklists & next steps', icon: '✅' },
        { id: 'tldr', label: 'TL;DR', desc: '30-second read', icon: '⏱️' },
    ];

    const handleGenerate = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoading(true);
        try {
            const res = await fetch('/api/gemini/summarizer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sources,
                    format: digestFormat,
                    knowledgeContext
                }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.summary);
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
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">DIGEST STUDIO</h1>
                    <p className="text-sm text-[#888888] font-medium">Condensing multiple sources into high-value summaries.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || sources.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Agent is Reading...' : 'Generate Digest'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Formats */}
                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">Digest Format</h3>
                    {formats.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setDigestFormat(f.id)}
                            className={`p-5 rounded-2xl border text-left transition-all ${digestFormat === f.id
                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg'
                                : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-emerald-500'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xl">{f.icon}</span>
                                <span className="font-bold text-base">{f.label}</span>
                            </div>
                            <p className={`text-[11px] font-medium leading-relaxed ${digestFormat === f.id ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Right: Content */}
                <div className="col-span-8 flex flex-col bg-white border border-[#E5E5E5] rounded-[32px] shadow-sm overflow-hidden relative">
                    <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Your condensed brief will appear here..."
                            className="w-full h-full resize-none border-none outline-none text-[#1A1A1A] text-lg leading-relaxed bg-transparent font-medium"
                        />
                    </div>
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
