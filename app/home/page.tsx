'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SavedContent, Source } from '../playground/types';

interface ContentItem extends SavedContent { }

export default function ProfilePage() {
  const router = useRouter();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'recent'>('saved');
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_content');
      if (saved) {
        try {
          setContentItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved content", e);
        }
      }
    }
  }, []);

  const getContentDetails = (content: string, defaultTitle: string) => {
    try {
      const parsed = JSON.parse(content);
      const metadata = parsed.metadata || {};
      return {
        displayTitle: metadata.project_title || metadata.title || defaultTitle,
        displayDescription: metadata.overall_narrative || metadata.description || content,
        tags: metadata.tags || []
      };
    } catch (e) {
      return {
        displayTitle: defaultTitle,
        displayDescription: content,
        tags: []
      };
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'blog':
      case 'article':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'tweet':
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'news':
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.101-1.101" />
          </svg>
        );
    }
  };

  const handleFeedback = (e: React.MouseEvent, id: number, type: 'up' | 'down') => {
    e.stopPropagation();
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  return (
    <div className="flex min-h-screen bg-white text-[#242424] font-sans relative overflow-hidden">
      {/* Floating Left Island Navbar with New Elements */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <nav className="bg-[#2B2B2B] border border-[#404040] rounded-full px-4 py-8 shadow-2xl flex flex-col items-center gap-8 backdrop-blur-md bg-opacity-95">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>

          <button onClick={() => router.push('/')} className="text-[#B3B3B3] hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </button>

          <button className="text-[#B3B3B3] hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          </button>

          <button className="text-[#B3B3B3] hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
          </button>

          <button className="text-[#B3B3B3] hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
          </button>

          <div className="w-8 border-t border-[#404040]"></div>

          <button onClick={() => router.push('/playground')} className="text-[#B3B3B3] hover:text-white transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-[#FFD600] to-[#FF00D6] rounded-full mt-2 ring-2 ring-offset-2 ring-offset-black ring-transparent hover:ring-white transition-all cursor-pointer"></div>
        </nav>
      </div>

      {/* Main Content Area - Added padding-left to account for floating sidebar and margin-right for fixed right sidebar */}
      <main className="flex-1 flex justify-center ml-0 md:ml-20 mr-0 xl:mr-[400px]">
        <div className="max-w-[700px] w-full flex flex-col min-h-screen">
          {/* Search Bar & Tabs */}
          <div className="pt-8 px-6 lg:px-14">
            <div className="flex items-center bg-[#F9F9F9] rounded-full px-4 py-2 mb-10 w-full group">
              <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Keep up with the latest in any topic"
                className="bg-transparent border-none outline-none ml-2 text-sm text-[#242424] w-full placeholder-[#6B6B6B]"
              />
            </div>

            <div className="flex gap-8 border-b border-[#F2F2F2]">
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-4 text-sm font-medium transition-colors border-b ${activeTab === 'saved' ? 'border-[#242424] text-[#242424]' : 'border-transparent text-[#6B6B6B] hover:text-[#242424]'}`}
              >
                Saved Items
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`pb-4 text-sm font-medium transition-colors border-b ${activeTab === 'recent' ? 'border-[#242424] text-[#242424]' : 'border-transparent text-[#6B6B6B] hover:text-[#242424]'}`}
              >
                Recent Generations
              </button>
            </div>
          </div>

          {/* Content Feed */}
          <div className="flex-1 overflow-y-auto pt-10 px-6 lg:px-14">
            <div className="space-y-12">
              {contentItems.map((item) => {
                const { displayTitle, displayDescription, tags } = getContentDetails(item.content, item.title);
                return (
                  <article
                    key={item.id}
                    className="flex flex-col group cursor-pointer"
                    onClick={() => router.push(`/playground/${item.id}`)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-[#F2F2F2] rounded-full overflow-hidden flex items-center justify-center">
                        {item.platform === 'twitter' ? (
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#242424]">AI Generator</span>
                      <span className="text-xs text-[#6B6B6B]">• {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <div className="flex gap-6 justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-[#242424] mb-2 leading-tight line-clamp-2">
                          {displayTitle}
                        </h2>
                        <p className="text-[#6B6B6B] text-base leading-relaxed line-clamp-3 font-serif">
                          {displayDescription}
                        </p>
                      </div>
                      <div className="w-[112px] h-[112px] bg-[#F2F2F2] rounded-md overflow-hidden flex-shrink-0 relative hidden sm:block">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#E0E0E0] to-[#E0E0E0]/50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#BDBDBD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </div>
                      </div>
                    </div>

                    {item.sources && item.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.sources.map((source) => (
                          <div
                            key={source.id}
                            className="flex items-center gap-1.5 px-2 py-1 bg-[#F9F9F9] rounded border border-[#F2F2F2] max-w-[150px]"
                          >
                            <div className="flex-shrink-0 text-[#6B6B6B]">
                              {getSourceIcon(source.type)}
                            </div>
                            <span className="text-[10px] font-medium text-[#6B6B6B] truncate">
                              {source.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pb-8 border-b border-[#F2F2F2]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#6B6B6B]">
                          {Math.ceil(item.content.length / 1000) || 1} min read
                        </span>
                      </div>                      <div className="flex items-center gap-4 text-[#6B6B6B]">
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
                          className={`hover:text-black transition-all cursor-pointer ${feedback[item.id] === 'down' ? 'text-black' : ''}`}
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
                <div className="text-center py-20 bg-[#F9F9F9] rounded-3xl border border-[#F2F2F2]">
                  <p className="text-[#6B6B6B] text-lg mb-6">No generations found yet.</p>
                  <button
                    onClick={() => router.push('/playground')}
                    className="px-8 py-2.5 bg-[#242424] text-white rounded-full text-sm font-medium hover:bg-black transition-all"
                  >
                    Start Creating
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Fixed and non-scrollable */}
      <aside className="hidden xl:flex flex-col w-[400px] h-screen fixed right-0 top-0 px-6 py-6 overflow-hidden z-40">
        <div className="h-full bg-white border border-[#D4D4D4] rounded-[2.5rem] shadow-sm flex flex-col p-6 overflow-y-auto no-scrollbar">
          <button className="w-full bg-[#2B2B2B] text-white rounded-full py-3 mb-8 font-medium text-sm hover:bg-black transition-all shadow-md">
            Get unlimited access
          </button>

          <div className="mb-8">
            <div className="flex items-center bg-white border border-[#D4D4D4] rounded-3xl px-4 py-2.5 group focus-within:ring-2 focus-within:ring-[#2B2B2B] focus-within:border-[#2B2B2B] transition-all">
              <svg className="w-4 h-4 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" placeholder="Search topics..." className="bg-transparent border-none outline-none ml-2 text-sm text-[#2B2B2B] w-full placeholder-[#B3B3B3]" />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-bold text-[#2B2B2B]">What We're Reading Today</h3>
              <span className="px-2 py-0.5 bg-[#2B2B2B] text-white text-[10px] font-bold rounded-full">3</span>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex items-center gap-3 bg-white border border-[#D4D4D4] rounded-2xl hover:shadow-md hover:border-[#B3B3B3] transition-all cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${i % 2 === 0 ? 'bg-[#D4D4D4]' : 'bg-[#B3B3B3]'} text-[#2B2B2B]`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#2B2B2B] leading-tight line-clamp-2 group-hover:text-black transition-colors">
                      {i === 1 ? "Top 10 Content Strategies for 2026" : i === 2 ? "Mastering the Art of Narrative Generation" : "The Future of AI in Creative Writing"}
                    </h4>
                    <p className="text-[10px] text-[#B3B3B3] mt-0.5">Curated Pack</p>
                  </div>
                </div>
              ))}
              <button className="text-[#2B2B2B] text-xs font-semibold hover:underline mt-2 flex items-center gap-1">
                See the full list
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>

          <div className="pb-4">
            <h3 className="text-sm font-bold text-[#2B2B2B] mb-4">Recommended Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Money', 'Business', 'Productivity', 'Art', 'Mindfulness', 'Design', 'AI'].map((topic) => (
                <button
                  key={topic}
                  className="bg-white border border-[#D4D4D4] hover:bg-[#F9F9F9] hover:border-[#B3B3B3] text-[#2B2B2B] px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
