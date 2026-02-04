import { Source, SourceType } from '../types';
import { SourceCard } from './SourceCard';

interface SourcesPanelProps {
    sources: Source[];
    isAddingSource: boolean;
    newSourceUrl: string;
    expandedSource: number | null;
    activeTab: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null;
    setNewSourceUrl: (url: string) => void;
    setIsAddingSource: (isAdding: boolean) => void;
    handleCreateSource: () => void;
    addSource: () => void;
    removeSource: (id: number) => void;
    toggleExpand: (id: number) => void;
    onGenerate: () => void;
    onRefine: (instructions: string) => void;
    isGenerating?: boolean;
    isRefining?: boolean;
    isMounted?: boolean;
    refinementInstructions: string;
    setRefinementInstructions: (val: string) => void;
}

export function SourcesPanel({
    sources,
    isAddingSource,
    newSourceUrl,
    expandedSource,
    activeTab,
    setNewSourceUrl,
    setIsAddingSource,
    handleCreateSource,
    addSource,
    removeSource,
    toggleExpand,
    onGenerate,
    onRefine,
    isGenerating = false,
    isRefining = false,
    isMounted = false,
    refinementInstructions,
    setRefinementInstructions,
}: SourcesPanelProps) {

    const isKnowledgeGraphMode = activeTab === null;

    const getSourceIcon = (type: SourceType) => {
        switch (type) {
            case 'youtube': return '📺';
            case 'blog': return '✍️';
            case 'news': return '📰';
            case 'tweet': return '🐦';
            case 'article': return '📄';
            case 'github': return '💻';
            case 'doc': return '📚';
        }
    };

    const getSourceColor = (type: SourceType) => {
        switch (type) {
            case 'github': return 'bg-[#2B2B2B] text-white';
            default: return 'bg-[#D4D4D4] text-[#2B2B2B]';
        }
    };

    return (
        <div className="w-96 bg-[#FFFFFF] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="h-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-[32px] shadow-sm flex flex-col gap-4 p-6">

                    {isKnowledgeGraphMode ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold text-[#2B2B2B]">Sources</h2>
                                    {isMounted && sources.length > 0 && (
                                        <span className="px-2 py-0.5 bg-[#2B2B2B] text-white text-[10px] font-bold rounded-full">
                                            {sources.length}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={addSource}
                                    className="px-3 py-1.5 bg-[#FFFFFF] border border-[#D4D4D4] rounded-full text-xs font-medium text-[#2B2B2B] hover:bg-[#D4D4D4] hover:border-[#B3B3B3] transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                    <span className="text-base leading-none">+</span> Add
                                </button>
                            </div>

                            {isAddingSource ? (
                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-[#B3B3B3] uppercase tracking-widest">Connect New Node</label>
                                        <input
                                            type="url"
                                            value={newSourceUrl}
                                            onChange={(e) => setNewSourceUrl(e.target.value)}
                                            placeholder="Paste URL (GitHub, YouTube, Web)"
                                            className="w-full rounded-2xl border border-[#D4D4D4] px-4 py-3 text-sm text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] focus:border-[#2B2B2B]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingSource(false);
                                                setNewSourceUrl('');
                                            }}
                                            className="px-4 py-2 rounded-full text-xs font-bold text-[#B3B3B3] hover:text-[#2B2B2B]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCreateSource}
                                            className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#2B2B2B] hover:bg-black disabled:opacity-50"
                                            disabled={!newSourceUrl.trim()}
                                        >
                                            Add Node
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                                    {sources.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-[#F5F5F5] rounded-[32px]">
                                            <span className="text-4xl mb-4 opacity-20">📂</span>
                                            <p className="text-xs text-[#B3B3B3] font-medium leading-relaxed uppercase tracking-wider">
                                                Knowledge Graph is empty.<br /> Add sources to begin.
                                            </p>
                                        </div>
                                    ) : (
                                        sources.map((source) => (
                                            <SourceCard
                                                key={source.id}
                                                source={source}
                                                expandedSource={expandedSource}
                                                toggleExpand={toggleExpand}
                                                removeSource={removeSource}
                                                getSourceColor={getSourceColor}
                                                getSourceIcon={getSourceIcon as any}
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            <div className="pt-4 mt-auto border-t border-[#F5F5F5]">
                                <button
                                    onClick={onGenerate}
                                    disabled={isGenerating || sources.length === 0}
                                    className={`w-full py-4 px-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl ${isGenerating
                                        ? 'bg-[#E5E5E5] text-gray-400 cursor-wait'
                                        : 'bg-[#1A1A1A] hover:bg-black text-white active:scale-95'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                                            Orchestrating...
                                        </>
                                    ) : 'Initialize Knowledge Graph'}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Agent Mode: Edit Section */
                        <div className="h-full flex flex-col gap-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest">Agent Refinement Engine</h3>
                            </div>

                            <div className="flex-1 flex flex-col bg-[#F9F9FB] border border-[#EEEEF2] rounded-[32px] p-6">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Input Modification Instructions</label>
                                <textarea
                                    value={refinementInstructions}
                                    onChange={(e) => setRefinementInstructions(e.target.value)}
                                    placeholder="Examples:
- Make the tone more technical
- Focus more on the YouTube transcript
- Add a specific section about X"
                                    className="flex-1 w-full bg-transparent border-none outline-none resize-none text-sm font-medium text-[#1A1A1A] placeholder-gray-300 leading-relaxed"
                                />
                                <div className="mt-4 pt-4 border-t border-[#EEEEF2]">
                                    <button
                                        onClick={() => onRefine(refinementInstructions)}
                                        disabled={isRefining || !refinementInstructions.trim()}
                                        className="w-full py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                                    >
                                        {isRefining ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Refining...
                                            </>
                                        ) : 'Update Content'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Knowledge Nodes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {sources.map(s => (
                                        <div key={s.id} className="px-2 py-1 bg-white border border-slate-100 rounded-md text-[9px] font-black text-slate-500 uppercase">
                                            {s.type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
            `}</style>
        </div>
    );
}
