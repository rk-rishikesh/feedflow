"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DefaultEditorProps {
    draftContent: string;
    setDraftContent: (content: string) => void;
    isGenerating: boolean;
    knowledgeContext?: any;
}

export function DefaultEditor({ draftContent, setDraftContent, isGenerating, knowledgeContext }: DefaultEditorProps) {
    const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});

    const toggleNode = (idx: number) => {
        setExpandedNodes(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    if (isGenerating) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-64 h-64 mb-8 grayscale"
                >
                    <Image
                        src="/assets/characters/one.svg"
                        alt="Agent Mascot"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-2 tracking-tight uppercase">Architecting Intelligence...</h2>
                <p className="text-[#888888] max-w-sm mx-auto font-medium text-sm leading-relaxed">
                    Connecting specialized agents and mapping data nodes.
                </p>
            </div>
        );
    }

    if (!knowledgeContext) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="relative w-64 h-64 mb-8">
                    <Image
                        src="/assets/characters/one.svg"
                        alt="Agent Mascot"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h2 className="text-3xl font-black text-[#1A1A1A] mb-4 tracking-tight">Ready to Engineer?</h2>
                <p className="text-[#888888] max-w-sm mx-auto mb-8 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">
                    Initialize your knowledge graph to begin.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#D4D4D4] uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-[#E5E5E5]" />
                    Feed Flow Studio
                    <span className="w-8 h-[1px] bg-[#E5E5E5]" />
                </div>
            </div>
        );
    }

    const projectName = knowledgeContext.projectName || "Untitled Project";

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            <div className="shrink-0 mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        Intelligence Core
                    </div>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                </div>
                <h1 className="text-6xl font-black text-[#1A1A1A] tracking-tighter mb-4 leading-none lowercase">
                    {projectName}.
                </h1>
                <p className="text-lg text-gray-400 font-medium max-w-2xl leading-relaxed">
                    Knowledge graph synthesized from {knowledgeContext.totalSources} distinct data points. Open nodes to inspect architectural insights.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-20">
                <div className="space-y-4">
                    {knowledgeContext.sources?.map((s: any, idx: number) => {
                        const isExpanded = expandedNodes[idx];
                        return (
                            <div
                                key={idx}
                                className={`group border-b border-gray-100 last:border-0 transition-all ${isExpanded ? 'bg-gray-50/50 -mx-4 px-4 py-6 rounded-[32px]' : 'py-4'}`}
                            >
                                <button
                                    onClick={() => toggleNode(idx)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? 'bg-black text-white' : 'bg-gray-50 group-hover:bg-gray-100 text-gray-400'}`}>
                                            {s.type === 'youtube' ? '📺' : s.type === 'github' ? '💻' : '📄'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.type} Node</span>
                                                {s.processingStatus === 'error' && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight group-hover:text-black">
                                                {s.title || s.url}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-8 pl-14 space-y-8">
                                                {/* Summary Section */}
                                                <div className="max-w-3xl">
                                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Synthesized Summary</h4>
                                                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                                        {s.data?.insights?.summary || s.data?.transcript?.substring(0, 300) + '...' || "No summary available for this node."}
                                                    </p>
                                                </div>

                                                {/* Key Moments Section */}
                                                {s.data?.keyMoments && s.data.keyMoments.length > 0 && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="col-span-full">
                                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Extracted Architecure</h4>
                                                        </div>
                                                        {s.data.keyMoments.map((km: any, ki: number) => (
                                                            <div key={ki} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                                                <div className="shrink-0 font-black text-xs text-black/20 font-mono pt-1">
                                                                    {km.time || `#0${ki + 1}`}
                                                                </div>
                                                                <div className="text-sm font-semibold text-gray-700 leading-snug">
                                                                    {km.description}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Metadata Node */}
                                                <div className="pt-6 border-t border-gray-100 flex items-center gap-6">
                                                    <div>
                                                        <div className="text-[9px] font-black text-gray-300 uppercase mb-1">Source URL</div>
                                                        <div className="text-[10px] font-bold text-blue-500 truncate max-w-xs">{s.url}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-black text-gray-300 uppercase mb-1">Status</div>
                                                        <div className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Connection Verified</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F1F1; border-radius: 10px; }
            `}</style>
        </div>
    );
}
