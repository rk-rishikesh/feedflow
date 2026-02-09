'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SavedContent, Source } from '../../playground/types';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface MainFeedProps {
    contentItems: SavedContent[];
    getContentDetails: (content: string, defaultTitle: string) => {
        displayTitle: string;
        displayDescription: string;
        tags: string[]
    };
    getSourceIcon: () => React.ReactNode;
    onDelete: (id: number) => void;
}

export default function MainFeed({ contentItems, getContentDetails, getSourceIcon, onDelete }: MainFeedProps) {
    const router = useRouter();
    const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});

    const handleFeedback = (e: React.MouseEvent, id: number, type: 'up' | 'down') => {
        e.stopPropagation();
        setFeedback(prev => ({
            ...prev,
            [id]: prev[id] === type ? null : type
        }));
    };

    return (
        <main className="flex-1 flex justify-center mr-0 xl:mr-[30%] transition-all bg-white">
            <div className="w-full max-w-[1200px] flex flex-col min-h-screen">
                {/* Top Navigation & Brand */}
                <div className="pt-8 px-12 lg:px-20 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Image src="/assets/logo.png" alt="Logo" width={24} height={24} />
                        <span className="text-xl text-[#2B2B2B]">Rizz Network</span>
                    </div>
                </div>

                {/* Content Feed */}
                <div className="flex-1 overflow-y-auto pt-10 px-12 lg:px-20 no-scrollbar">
                    <div className="w-full pb-20">
                        {contentItems.length > 0 ? (
                            <div className="w-full">
                                {/* Table Header */}
                                <div className="flex items-center px-4 py-3 border-b border-[#F2F2F2] text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider">
                                    <div className="flex-1">Project Name</div>
                                    <div className="w-32 text-center">Feedback</div>
                                    <div className="w-32 text-center">Created</div>
                                    <div className="w-16 text-center">Erase</div>
                                </div>

                                {/* List Items */}
                                <div className="divide-y divide-[#F2F2F2]">
                                    {contentItems.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center px-4 py-4 hover:bg-[#F9F9F9] transition-colors group cursor-pointer"
                                                onClick={() => router.push(`/playground/${item.id}`)}
                                            >
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-[#F8F9FA] border border-[#EEEEEE] flex items-center justify-center text-[#2B2B2B]">
                                                        {getSourceIcon()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold text-[#2B2B2B] truncate max-w-[400px]">
                                                            {item.knowledgeContext.projectName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="w-32 flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={(e) => handleFeedback(e, item.id, 'up')}
                                                        className={`p-2 rounded-lg transition-all hover:bg-white ${feedback[item.id] === 'up' ? 'text-[#1A8917]' : 'text-[#D4D4D4] hover:text-[#6B6B6B]'}`}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={feedback[item.id] === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleFeedback(e, item.id, 'down')}
                                                        className={`p-2 rounded-lg transition-all hover:bg-white ${feedback[item.id] === 'down' ? 'text-red-500' : 'text-[#D4D4D4] hover:text-[#6B6B6B]'}`}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={feedback[item.id] === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                                                    </button>
                                                </div>

                                                <div className="w-32 text-center text-[11px] font-bold text-[#6B6B6B]">
                                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>

                                                <div className="w-16 flex justify-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(item.id);
                                                        }}
                                                        className="p-2 text-[#D4D4D4] hover:text-[#6B6B6B] hover:transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center max-h-[60vh]">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="relative w-64 h-64 mb-12 group"
                                >
                                    <Image
                                        src="/assets/characters/seven.svg"
                                        alt="Empty Mascot"
                                        fill
                                        className="object-contain transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                >
                                    <h2 className="text-4xl font-black text-[#1A1A1A] mb-4 tracking-tighter">Your library is silent.</h2>
                                    <p className="text-[#888888] max-w-[320px] mx-auto mb-12 font-bold uppercase text-[10px] tracking-[0.3em] leading-relaxed">
                                        Architect your first knowledge graph to populate this feed.
                                    </p>
                                    <button
                                        onClick={() => router.push('/playground')}
                                        className="px-12 py-5 bg-[#1A1A1A] text-white rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-black/10 active:scale-95 flex items-center gap-4 mx-auto group"
                                    >
                                        <span>Start Architecting</span>
                                        <svg
                                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
