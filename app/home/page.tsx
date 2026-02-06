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

  const getSourceIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );

  const deleteItem = (id: number) => {
    const updated = contentItems.filter(item => item.id !== id);
    setContentItems(updated);
    localStorage.setItem('saved_content', JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-white text-[#2B2B2B] font-sans relative overflow-hidden">
      {/* Modular Main Feed */}
      <MainFeed
        contentItems={contentItems}
        getContentDetails={getContentDetails}
        getSourceIcon={getSourceIcon}
        onDelete={deleteItem}
      />

      {/* Modular Sidebar */}
      <Sidebar />
    </div>
  );
}
