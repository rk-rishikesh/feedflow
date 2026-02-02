'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SavedContent, Source } from '../../playground/types';

interface MainFeedProps {
    contentItems: SavedContent[];
    getContentDetails: (content: string, defaultTitle: string) => {
        displayTitle: string;
        displayDescription: string;
        tags: string[]
    };
    getSourceIcon: (type: string) => React.ReactNode;
}

export default function MainFeed({ contentItems, getContentDetails, getSourceIcon }: MainFeedProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'saved' | 'recent'>('saved');
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
                        className="px-6 py-2 bg-[#2B2B2B] text-white rounded-full text-xs font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-12 lg:px-20">
                    <div className="flex gap-8 border-b border-[#F2F2F2]">
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'saved' ? 'border-[#2B2B2B] text-[#2B2B2B]' : 'border-transparent text-[#6B6B6B] hover:text-[#2B2B2B]'}`}
                        >
                            Saved Items
                        </button>
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'recent' ? 'border-[#2B2B2B] text-[#2B2B2B]' : 'border-transparent text-[#6B6B6B] hover:text-[#2B2B2B]'}`}
                        >
                            Recent Generations
                        </button>
                    </div>
                </div>

                {/* Content Feed */}
                <div className="flex-1 overflow-y-auto pt-10 px-12 lg:px-20 no-scrollbar">
                    <div className="space-y-12 pb-20">
                        {contentItems.map((item) => {
                            const { displayTitle, displayDescription } = getContentDetails(item.content, item.title);
                            return (
                                <article
                                    key={item.id}
                                    className="flex flex-col group cursor-pointer"
                                    onClick={() => router.push(`/playground/${item.id}`)}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-5 h-5 bg-[#F2F2F2] rounded-full overflow-hidden flex items-center justify-center">
                                            {item.platform === 'twitter' ? (
                                                <svg className="w-3 h-3 text-[#2B2B2B]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                                            )}
                                        </div>
                                        <span className="text-xs font-medium text-[#2B2B2B]">AI Generator</span>
                                        <span className="text-xs text-[#6B6B6B]">• {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>

                                    <div className="flex gap-6 justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-[#2B2B2B] mb-2 leading-tight line-clamp-2 transition-colors group-hover:text-black">
                                                {displayTitle}
                                            </h2>
                                            <p className="text-[#6B6B6B] text-base leading-relaxed line-clamp-3 font-serif">
                                                {displayDescription}
                                            </p>
                                        </div>
                                        <div className="w-[112px] h-[112px] bg-[#F2F2F2] rounded-2xl overflow-hidden flex-shrink-0 relative hidden sm:block border border-[#EEEEEE] group-hover:shadow-md transition-all">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#E0E0E0] to-[#E5E5E5] flex items-center justify-center">
                                                <svg className="w-8 h-8 text-[#BDBDBD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {item.sources && item.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.sources.map((source) => (
                                                <div
                                                    key={source.id}
                                                    className="flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F9] rounded-full border border-[#EEEEEE] max-w-[180px]"
                                                >
                                                    <div className="flex-shrink-0 text-[#6B6B6B]">
                                                        {getSourceIcon(source.type)}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-[#6B6B6B] truncate">
                                                        {source.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pb-8 border-b border-[#F2F2F2]">
                                        <div className="flex items-center gap-3 text-xs text-[#6B6B6B] font-medium">
                                            {Math.ceil(item.content.length / 1000) || 1} min read
                                        </div>
                                        <div className="flex items-center gap-4 text-[#6B6B6B]">
                                            <button
                                                onClick={(e) => handleFeedback(e, item.id, 'up')}
                                                className={`hover:text-[#1A8917] transition-all cursor-pointer ${feedback[item.id] === 'up' ? 'text-[#1A8917]' : ''}`}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill={feedback[item.id] === 'up' ? 'currentColor' : 'none'}
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleFeedback(e, item.id, 'down')}
                                                className={`hover:text-[#2B2B2B] transition-all cursor-pointer ${feedback[item.id] === 'down' ? 'text-[#2B2B2B]' : ''}`}
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill={feedback[item.id] === 'down' ? 'currentColor' : 'none'}
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {contentItems.length === 0 && (
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
