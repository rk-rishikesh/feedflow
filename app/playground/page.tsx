'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type SourceType = 'youtube' | 'blog' | 'news' | 'tweet' | 'article';

interface Source {
  id: number;
  type: SourceType;
  title: string;
  url: string;
  thumbnail?: string;
  author?: string;
  date?: string;
  description?: string;
}

export default function PlaygroundPage() {
  const router = useRouter();
  const [draftContent, setDraftContent] = useState(`Content creation is important for digital marketing as it involves creating and sharing various types of content to attract and engage the target audience, improve SEO, and drive traffic and conv...`);
  const [sources, setSources] = useState<Source[]>([
    {
      id: 1,
      type: 'youtube',
      title: 'Introduction to Content Marketing',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      author: 'Marketing Pro',
      date: '2 days ago',
      description: 'Learn the fundamentals of content marketing and how to create engaging content that drives results.'
    },
    {
      id: 2,
      type: 'blog',
      title: 'SEO Best Practices for 2024',
      url: 'https://example.com/blog/seo-2024',
      author: 'Tech Blog',
      date: '1 week ago',
      description: 'Discover the latest SEO strategies and techniques that will help improve your search rankings.'
    },
    {
      id: 3,
      type: 'news',
      title: 'AI Revolution in Digital Marketing',
      url: 'https://example.com/news/ai-marketing',
      author: 'Tech News',
      date: '3 days ago',
      description: 'How artificial intelligence is transforming the digital marketing landscape.'
    },
    {
      id: 4,
      type: 'tweet',
      title: 'Content creation tips thread',
      url: 'https://twitter.com/user/status/123456',
      author: '@ContentCreator',
      date: '5 hours ago',
      description: 'A thread sharing valuable tips for content creators looking to grow their audience.'
    },
  ]);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null>(null);

  const addSource = () => {
    setIsAddingSource(true);
    setNewSourceUrl('');
  };

  const handleCreateSource = () => {
    const url = newSourceUrl.trim();
    if (!url) return;

    const newSource: Source = {
      id: Date.now(),
      type: 'article',
      title: url,
      url,
      author: 'Unknown',
      date: 'Just now',
    };

    setSources((prev) => [newSource, ...prev]);
    setIsAddingSource(false);
    setNewSourceUrl('');
  };

  const removeSource = (id: number) => {
    setSources(sources.filter((source) => source.id !== id));
    if (expandedSource === id) {
      setExpandedSource(null);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedSource(expandedSource === id ? null : id);
    // Scroll the expanded card into view
    setTimeout(() => {
      const element = document.getElementById(`source-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

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
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF] relative overflow-hidden">
      {/* Floating Left Island Navbar */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50">
        <nav className="bg-[#2B2B2B] border border-[#B3B3B3] rounded-full px-6 py-8 shadow-lg flex flex-col items-center gap-8">
          
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center gap-2 text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
         
          <button 
            onClick={() => setActiveTab('twitter')}
            className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'twitter' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab('linkedin')}
            className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'linkedin' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab('blog')}
            className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'blog' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'summary' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab('image')}
            className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'image' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center gap-2 text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button
            onClick={() => router.back()}
            className="flex flex-col items-center gap-2 text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className=" flex-1 flex flex-col overflow-hidden pl-32">
        {/* Editor and Preview Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FFFFFF]">
            <div className="flex-1 flex flex-col overflow-hidden p-8">
              {activeTab === 'twitter' && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Twitter Preview</h1>
                  <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#D4D4D4] flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#2B2B2B]">Your Name</span>
                          <span className="text-[#B3B3B3]">@username</span>
                          <span className="text-[#B3B3B3]">·</span>
                          <span className="text-[#B3B3B3]">now</span>
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="What's happening?"
                      className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent"
                    />
                    <div className="mt-4 pt-4 border-t border-[#D4D4D4] flex items-center justify-between text-[#B3B3B3]">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                        <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs">{draftContent.length} / 280</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'linkedin' && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">LinkedIn Preview</h1>
                  <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#D4D4D4] flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#2B2B2B]">Your Name</span>
                          <span className="text-[#B3B3B3]">·</span>
                          <span className="text-[#B3B3B3]">1st</span>
                        </div>
                        <p className="text-xs text-[#B3B3B3]">Your Title · Your Company</p>
                      </div>
                    </div>
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent mb-4"
                    />
                    <div className="flex items-center gap-4 pt-4 border-t border-[#D4D4D4] text-[#B3B3B3]">
                      <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">Like</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#2B2B2B] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-sm">Share</span>
                      </button>
                      <div className="ml-auto text-xs">{draftContent.length} characters</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                  <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Blog Preview</h1>
                  <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-[#2B2B2B] mb-3">Blog Post Title</h2>
                      <div className="flex items-center gap-3 text-sm text-[#B3B3B3]">
                        <span>By Your Name</span>
                        <span>·</span>
                        <span>Published now</span>
                      </div>
                    </div>
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Start writing your blog post..."
                      className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent"
                    />
                    <div className="mt-4 pt-4 border-t border-[#D4D4D4] text-xs text-[#B3B3B3]">
                      {draftContent.length} characters
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                  <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Summary Preview</h1>
                  <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <svg className="w-8 h-8 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-[#2B2B2B]">Content Summary</h2>
                      </div>
                    </div>
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Your summary will appear here..."
                      className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed bg-transparent"
                    />
                    <div className="mt-4 pt-4 border-t border-[#D4D4D4] text-xs text-[#B3B3B3]">
                      {draftContent.length} characters
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'image' && (
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                  <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Image Preview</h1>
                  <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#D4D4D4] rounded-2xl p-8 shadow-sm">
                    <div className="mb-6">
                      <div className="w-full h-64 bg-[#D4D4D4] rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-16 h-16 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#B3B3B3] text-center">Image placeholder</p>
                    </div>
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Add image caption or description..."
                      className="flex-1 w-full p-0 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-sm leading-relaxed bg-transparent"
                    />
                    <div className="mt-4 pt-4 border-t border-[#D4D4D4] text-xs text-[#B3B3B3]">
                      {draftContent.length} characters
                    </div>
                  </div>
                </div>
              )}

              {!activeTab && (
                <div className="flex-1 flex flex-col">
                  <h1 className="text-2xl font-semibold text-[#2B2B2B] mb-6">Write Post</h1>
                  <div className="flex-1 flex flex-col bg-[#FFFFFF]">
                    <textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Start writing..."
                      className="flex-1 w-full p-6 resize-none border-none outline-none text-[#2B2B2B] placeholder-[#B3B3B3] text-base leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#B3B3B3] mt-4">
                    <span>{draftContent.length} characters</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sources Section */}
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
                  <div className="flex flex-col gap-3 pt-2">
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
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {sources.map((source) => {
                      const isExpanded = expandedSource === source.id;
                      return (
                        <div
                          id={`source-${source.id}`}
                          key={source.id}
                          className={`bg-[#FFFFFF] border border-[#D4D4D4] transition-all duration-300 ease-in-out ${isExpanded
                            ? 'rounded-2xl shadow-lg border-[#B3B3B3]'
                            : 'rounded-full cursor-pointer hover:shadow-md hover:border-[#B3B3B3]'
                            }`}
                          onClick={() => !isExpanded && toggleExpand(source.id)}
                        >
                          {/* Compact View */}
                          {!isExpanded ? (
                            <div className="px-4 py-3 flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${getSourceColor(source.type)}`}>
                                {getSourceIcon(source.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-[#2B2B2B] truncate">{source.title}</h3>
                                <p className="text-xs text-[#B3B3B3] truncate">{source.author || source.url}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSource(source.id);
                                }}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[#B3B3B3] hover:text-[#2B2B2B] hover:bg-[#D4D4D4] transition-all shrink-0"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            /* Expanded View */
                            <div className="overflow-hidden rounded-2xl">
                              {/* Header */}
                              <div className="p-5 flex items-start justify-between bg-[#FFFFFF]">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getSourceColor(source.type)}`}>
                                    {getSourceIcon(source.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-[#2B2B2B] mb-1">{source.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                                      {source.author && <span>{source.author}</span>}
                                      {source.date && <span>• {source.date}</span>}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(source.id);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center text-[#B3B3B3] hover:text-[#2B2B2B] transition-colors shrink-0"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>

                              {/* Content */}
                              <div className="px-5 pb-5 bg-[#FFFFFF] space-y-4">
                                {source.description && (
                                  <p className="text-sm text-[#2B2B2B] leading-relaxed">{source.description}</p>
                                )}
                                <div className="flex items-center justify-between gap-3">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-sm text-[#2B2B2B] hover:text-[#2B2B2B]/80 truncate flex-1 underline"
                                  >
                                    {source.url}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
