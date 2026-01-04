'use client';

import { useState } from 'react';

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

  const addSource = () => {
    const newSource: Source = {
      id: Date.now(),
      type: 'youtube',
      title: 'New Source',
      url: '',
      author: 'Unknown',
      date: 'Just now',
    };
    setSources([...sources, newSource]);
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
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
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
        return 'bg-red-100 text-red-600';
      case 'blog':
        return 'bg-blue-100 text-blue-600';
      case 'news':
        return 'bg-green-100 text-green-600';
      case 'tweet':
        return 'bg-sky-100 text-sky-600';
      case 'article':
        return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <div className="flex bg-gray-50 relative">
      {/* Main Content Area */}
      <div className=" flex-1 flex flex-col overflow-hidden pb-20">
        {/* Editor and Preview Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div className="min-h-screen flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto p-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Write Post</h1>
              {/* Text Editor */}
              <div className="bg-white mb-4">
                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Start writing..."
                  className="w-full min-h-[400px] p-6 resize-none border-none outline-none text-gray-900 placeholder-gray-400 text-base leading-relaxed"
                />
              </div>

              {/* Editor Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <span>Last saved at Oct 4, 2023, 10:34 AM</span>
                <span>{draftContent.length} characters</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                  Save as Draft
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule
                </button>
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publish
                </button>
              </div>
            </div>
          </div>

          {/* Sources Section */}
          <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sources</h2>
              <button
                onClick={addSource}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Source
              </button>
            </div>

            {/* Sources List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sources.map((source) => {
                const isExpanded = expandedSource === source.id;
                return (
                  <div
                    id={`source-${source.id}`}
                    key={source.id}
                    className={`bg-white border border-gray-200 transition-all duration-300 ease-in-out ${
                      isExpanded 
                        ? 'rounded-2xl shadow-lg border-gray-300' 
                        : 'rounded-full cursor-pointer hover:shadow-md hover:border-gray-300'
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
                          <h3 className="text-sm font-medium text-gray-900 truncate">{source.title}</h3>
                          <p className="text-xs text-gray-500 truncate">{source.author || source.url}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSource(source.id);
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
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
                        <div className="p-5 flex items-start justify-between bg-white">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getSourceColor(source.type)}`}>
                              {getSourceIcon(source.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 mb-1">{source.title}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
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
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Content */}
                        <div className="px-5 pb-5 bg-white space-y-4">
                          {source.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">{source.description}</p>
                          )}
                          <div className="flex items-center justify-between gap-3">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-blue-600 hover:text-blue-700 truncate flex-1"
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
          </div>
        </div>
      </div>

      {/* Fixed Bottom Island Navbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-lg flex items-center gap-6">
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs">Write</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs">Drafts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs">Analytics</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
