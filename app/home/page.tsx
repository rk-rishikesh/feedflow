'use client';

import { useState, useEffect } from 'react';
import MainFeed from './components/MainFeed';
import Sidebar from './components/Sidebar';
import { SavedContent } from '../playground/types';

export default function ProfilePage() {
  const [contentItems, setContentItems] = useState<SavedContent[]>([]);

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

  return (
    <div className="flex min-h-screen bg-white text-[#2B2B2B] font-sans relative overflow-hidden">
      {/* Modular Main Feed */}
      <MainFeed
        contentItems={contentItems}
        getContentDetails={getContentDetails}
        getSourceIcon={getSourceIcon}
      />

      {/* Modular Sidebar */}
      <Sidebar avatarUrl="/avatar.png" />
    </div>
  );
}
