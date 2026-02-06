'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SavedContent, Source } from '../../playground/types';
import Image from 'next/image';

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
                        <div className="w-8 h-8 bg-[#2B2B2B] rounded-xl flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                        <span className="text-xl font-black tracking-tight text-[#2B2B2B]">FeedFlow</span>
                    </div>
                    <button
                        onClick={() => router.push('/playground')}
                        className="px-6 py-2 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Image src="/assets/icons/create.png" alt="Plus" width={24} height={24} />
                    </button>
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
                                        const { displayTitle } = getContentDetails(item.content, item.title);
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
                                                            {displayTitle}
                                                        </span>
                                                        <span className="text-[10px] text-[#A3A3A3] font-medium uppercase tracking-tight">
                                                            {item.platform || 'Project'}
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
                            <div className="text-center py-24 bg-[#F9F9F9] rounded-[2.5rem] border border-dashed border-[#D4D4D4]">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <svg className="w-8 h-8 text-[#D4D4D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-[#6B6B6B] text-lg font-bold mb-2">Your library is empty</p>
                                <p className="text-[#A3A3A3] text-sm mb-8">Start generating content to see it appear here.</p>
                                <button
                                    onClick={() => router.push('/playground')}
                                    className="px-8 py-3 bg-[#2B2B2B] text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg shadow-black/5"
                                >
                                    Start Creating
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
