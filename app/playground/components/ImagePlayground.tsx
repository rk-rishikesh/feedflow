import { useState } from 'react';
import { Source } from '../types';

interface ImagePlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    knowledgeContext?: any;
}

export function ImagePlayground({
    sources,
    draftContent,
    setDraftContent,
    knowledgeContext
}: ImagePlaygroundProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('photorealistic');

    const styles = [
        { id: 'photorealistic', label: 'Photorealistic', desc: 'High-end photography', icon: '📸' },
        { id: 'digital_art', label: 'Digital Art', desc: 'Modern & Vibrant', icon: '🎨' },
        { id: 'minimalist', label: 'Minimalist', desc: 'Clean & Simple', icon: '⚪' },
        { id: '3d_render', label: '3D Render', desc: 'Octane/Unreal look', icon: '🧊' },
    ];

    const handleGeneratePrompt = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoading(true);
        try {
            // We'll reuse the text/social agent or create a specific prompt generator
            const res = await fetch('/api/gemini/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sources,
                    style: selectedStyle,
                    knowledgeContext
                }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.visual_prompt);
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
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">VISUAL STUDIO</h1>
                    <p className="text-sm text-[#888888] font-medium">Generating high-impact visual assets for your content.</p>
                </div>
                <button
                    onClick={handleGeneratePrompt}
                    disabled={isLoading || sources.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Agent is Visualizing...' : 'Generate Visual Concept'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Styles */}
                <div className="col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2">Artistic Direction</h3>
                    {styles.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedStyle(s.id)}
                            className={`p-5 rounded-2xl border text-left transition-all ${selectedStyle === s.id
                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg'
                                : 'bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-purple-500'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xl">{s.icon}</span>
                                <span className="font-bold text-base">{s.label}</span>
                            </div>
                            <p className={`text-[11px] font-medium leading-relaxed ${selectedStyle === s.id ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Right: Canvas */}
                <div className="col-span-8 flex flex-col bg-white border border-[#E5E5E5] rounded-[32px] shadow-sm overflow-hidden relative">
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-full aspect-video bg-gray-100 rounded-[32px] flex items-center justify-center border-2 border-dashed border-gray-200 mb-6">
                            <span className="text-gray-400 font-medium">Visual Preview will appear here</span>
                        </div>
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Describe your visual needs or generate a concept..."
                            className="w-full h-32 resize-none border-none outline-none text-[#1A1A1A] text-center text-lg leading-relaxed bg-transparent font-medium"
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
