import { Source, SourceType } from '../types';
import { SourceCard } from './SourceCard';

interface SourcesPanelProps {
    sources: Source[];
    isAddingSource: boolean;
    newSourceUrl: string;
    expandedSource: number | null;
    setNewSourceUrl: (url: string) => void;
    setIsAddingSource: (isAdding: boolean) => void;
    handleCreateSource: () => void;
    addSource: () => void;
    removeSource: (id: number) => void;
    toggleExpand: (id: number) => void;
    onGenerate: () => void;
    isGenerating?: boolean;
}

export function SourcesPanel({
    sources,
    isAddingSource,
    newSourceUrl,
    expandedSource,
    setNewSourceUrl,
    setIsAddingSource,
    handleCreateSource,
    addSource,
    removeSource,
    toggleExpand,
    onGenerate,
    isGenerating = false,
}: SourcesPanelProps) {

    const getSourceIcon = (type: SourceType) => {
        switch (type) {
            case 'youtube':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                );
            case 'blog':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case 'news':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                );
            case 'tweet':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                );
            case 'article':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'video':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    const getSourceColor = (type: SourceType) => {
        switch (type) {
            case 'youtube':
                return 'bg-[#D4D4D4] text-[#2B2B2B]';
            case 'blog':
                return 'bg-[#B3B3B3] text-[#2B2B2B]';
            case 'news':
                return 'bg-[#D4D4D4] text-[#2B2B2B]';
            case 'tweet':
                return 'bg-[#B3B3B3] text-[#2B2B2B]';
            case 'article':
                return 'bg-[#D4D4D4] text-[#2B2B2B]';
            case 'video':
                return 'bg-[#D4D4D4] text-[#2B2B2B]';
        }
    };

    return (
        <div className="w-96 bg-[#FFFFFF] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="h-full bg-[#FFFFFF] border border-[#D4D4D4] rounded-3xl shadow-sm flex flex-col gap-4 p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#2B2B2B]">Sources</h2>
                        <button
                            onClick={addSource}
                            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#D4D4D4] rounded-full text-xs font-medium text-[#2B2B2B] hover:bg-[#D4D4D4] hover:border-[#B3B3B3] transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add
                        </button>
                    </div>

                    {/* Add Source Form or Sources List */}
                    {isAddingSource ? (
                        <div className="flex-1 flex flex-col gap-3 pt-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-[#B3B3B3]">Add a source link</label>
                                <input
                                    type="url"
                                    value={newSourceUrl}
                                    onChange={(e) => setNewSourceUrl(e.target.value)}
                                    placeholder="https://example.com/article"
                                    className="w-full rounded-2xl border border-[#D4D4D4] px-3 py-2 text-sm text-[#2B2B2B] placeholder-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] focus:border-[#2B2B2B]"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingSource(false);
                                        setNewSourceUrl('');
                                    }}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium text-[#B3B3B3] hover:bg-[#D4D4D4]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateSource}
                                    className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-[#2B2B2B] hover:bg-[#2B2B2B]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!newSourceUrl.trim()}
                                >
                                    Add Source
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {sources.map((source) => (
                                <SourceCard
                                    key={source.id}
                                    source={source}
                                    expandedSource={expandedSource}
                                    toggleExpand={toggleExpand}
                                    removeSource={removeSource}
                                    getSourceColor={getSourceColor}
                                    getSourceIcon={getSourceIcon}
                                />
                            ))}
                        </div>
                    )}

                    {/* Generate Button */}
                    <div className="pt-4 mt-auto border-t border-[#D4D4D4]">
                        <button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className={`w-full py-3 px-4 rounded-3xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isGenerating
                                ? 'bg-[#2B2B2B]/70 cursor-wait text-white/50'
                                : 'bg-[#2B2B2B] hover:bg-[#2B2B2B]/90 text-white'
                                }`}
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Generate Content
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
