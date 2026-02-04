import { useState } from 'react';
import { Source, Thought } from '../types';
import { ThoughtHistory } from './ThoughtHistory';

interface ImagePlaygroundProps {
    sources: Source[];
    draftContent: string;
    setDraftContent: (content: string) => void;
    thoughts: Thought[];
    setThoughts: (thoughts: Thought[]) => void;
    knowledgeContext?: any;
    isProcessing?: boolean;
}

export function ImagePlayground({
    sources,
    draftContent,
    setDraftContent,
    thoughts,
    setThoughts,
    knowledgeContext,
    isProcessing = false
}: ImagePlaygroundProps) {
    const [isLoadingLocally, setIsLoadingLocally] = useState(false);
    const projectName = knowledgeContext?.projectName || "UNTITLED PROJECT";
    const activeLoading = isProcessing || isLoadingLocally;

    const handleGeneratePrompt = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsLoadingLocally(true);
        try {
            const res = await fetch('/api/gemini/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sources,
                    knowledgeContext
                }),
            });
            const data = await res.json();
            const parsed = JSON.parse(data.text);
            setDraftContent(parsed.visual_prompt);

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
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-black rounded-md uppercase tracking-wider">Project</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{projectName}</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">VISUAL STUDIO</h1>
                </div>
                <button
                    onClick={handleGeneratePrompt}
                    disabled={activeLoading || sources.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {activeLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Agent is Drawing...
                        </>
                    ) : 'Generate Visual Brief'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Left: Agent Thought Process History */}
                <div className="col-span-5 flex flex-col overflow-hidden">
                    <ThoughtHistory
                        thoughts={thoughts}
                        isLoading={activeLoading}
                        accentColor="#9333EA"
                        emptyIcon="🎨"
                    />
                </div>

                {/* Right: Canvas */}
                <div className="col-span-7 flex flex-col bg-white rounded-[32px] overflow-hidden relative">
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-full aspect-video bg-slate-50 rounded-[32px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 mb-6">
                            <span className="text-4xl mb-2 opacity-30">🖼️</span>
                            <span className="text-slate-400 font-medium text-sm">Output concept will appear below</span>
                        </div>
                        <textarea
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            placeholder="Architectural visual brief will generate here..."
                            className="w-full h-32 resize-none border-none outline-none text-[#1A1A1A] text-center text-lg leading-relaxed bg-transparent font-medium"
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
