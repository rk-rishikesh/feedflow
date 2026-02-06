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
    const [isSourceListExpanded, setIsSourceListExpanded] = useState(false);

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
                        src="/assets/characters/five.svg"
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
                        src="/assets/characters/six.svg"
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
            <div className="flex items-center justify-between shrink-0 mb-12 bg-gray-50/50 p-4 rounded-[24px]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-[#1A1A1A] tracking-widest uppercase mb-0.5">Intelligence Knowledge Graph</h2>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full custom-scrollbar pb-32 pt-8">
                {/* Editorial Header */}
                <div className="mb-20">
                    <h1 className="text-7xl font-black text-[#1A1A1A] tracking-tighter mb-8 leading-[0.9]">
                        {projectName}
                    </h1>
                </div>

                {/* Source Topology List */}
                <div className="mb-12">
                    <AnimatePresence>
                        {isSourceListExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="pl-7 pt-1 pb-4 flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {knowledgeContext.sources?.map((s: any, i: number) => (
                                        <a
                                            key={i}
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 text-sm group transition-colors w-fit max-w-full"
                                        >
                                            <span className="opacity-70 text-xs shrink-0">
                                                {s.type === 'youtube' ? '📺' : s.type === 'github' ? '💻' : '📄'}
                                            </span>
                                            <span className="text-gray-500 border-b border-transparent group-hover:border-gray-300 truncate transition-all">
                                                {s.data?.title || s.title || s.url}
                                            </span>
                                            <span className="text-[10px] text-gray-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">Open</span>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Narrative Flow */}
                <div className="space-y-12">
                    {knowledgeContext.sources?.map((s: any, idx: number) => {
                        const isNodeExpanded = expandedNodes[idx];
                        // Metadata Extraction
                        const domain = (() => {
                            try { return new URL(s.url).hostname.replace('www.', ''); } catch { return 'External Source'; }
                        })();
                        const readTime = (() => {
                            const content = s.data?.transcript || s.data?.insights?.summary || '';
                            const words = content.split(/\s+/).length;
                            return `${Math.max(1, Math.ceil(words / 200))} min ${s.type === 'youtube' ? 'watch' : 'read'}`;
                        })();

                        // Use AI Title if available, otherwise fall back to domain/manual title
                        const displayTitle = s.data?.title || s.title || domain;

                        return (
                            <div key={idx} className="relative transition-all animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                                {/* Source Header (Trigger) */}
                                <button
                                    onClick={() => toggleNode(idx)}
                                    className="w-full text-left group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-[11px] font-black text-black/20 font-mono tracking-tighter">
                                            NODE_{String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="h-[1px] flex-1 bg-gray-50 group-hover:bg-gray-200 transition-colors" />
                                        <div className="flex items-center gap-3">
                                            {/* Metadata Badges */}
                                            <div className="hidden sm:flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-gray-50 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wide">{domain}</span>
                                            </div>
                                            <div className="px-3 py-1 bg-gray-50 group-hover:bg-gray-100 rounded-full flex items-center gap-2 transition-all">
                                                <span className="text-[18px] grayscale opacity-50">
                                                    {s.type === 'youtube' ? '📺' : s.type === 'github' ? '💻' : '📄'}
                                                </span>
                                                <div className={`transition-transform duration-300 ml-1 ${isNodeExpanded ? 'rotate-180' : ''}`}>
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-black text-[#1A1A1A] tracking-tight mb-3 max-w-3xl leading-tight group-hover:text-gray-500 transition-colors bg-clip-text">
                                        {displayTitle}
                                    </h3>

                                    {!isNodeExpanded && (
                                        <div className="max-w-2xl">
                                            <p className="text-sm text-gray-400 font-medium line-clamp-2 leading-relaxed opacity-60">
                                                {s.data?.insights?.summary || s.data?.transcript || "Content summary not available..."}
                                            </p>
                                        </div>
                                    )}
                                </button>

                                {/* Collapsible Main Content */}
                                <AnimatePresence>
                                    {isNodeExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-0 pt-8">
                                                <div className="space-y-12">
                                                    <div className="max-w-3xl">
                                                        <p className="text-[22px] text-[#2D2D2D] leading-[1.6] font-medium selection:bg-blue-50">
                                                            {s.data?.insights?.summary || s.data?.transcript || "No synthesis available for this node."}
                                                        </p>
                                                    </div>

                                                    {/* Inline Highlights (Key Moments) */}
                                                    {s.data?.keyMoments && s.data.keyMoments.length > 0 && (
                                                        <div className="bg-gray-50/50 rounded-[40px] p-10 border border-gray-100/50">
                                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-4">
                                                                <div className="w-4 h-[1px] bg-gray-200" />
                                                                Architectural Takeaways
                                                                <div className="w-4 h-[1px] bg-gray-200" />
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                                                {s.data.keyMoments.map((km: any, ki: number) => (
                                                                    <div key={ki} className="flex gap-4 group/item">
                                                                        <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black font-mono text-black/30 group-hover/item:border-black group-hover/item:text-black transition-all">
                                                                            {String(ki + 1).padStart(2, '0')}
                                                                        </div>
                                                                        <div className="text-sm font-semibold text-gray-600 leading-relaxed pt-1 group-hover/item:text-black transition-colors">
                                                                            {km.description}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Expanded Link Section */}
                                                <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                                                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 hover:shadow-blue-200">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Access Source</span>
                                                        <svg className="w-3 h-3 text-white/70 group-hover/link:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    </a>
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
