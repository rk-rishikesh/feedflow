'use client';

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SourcesPanel } from './components/SourcesPanel';
import { TwitterPreview } from './components/TwitterPreview';
import { LinkedInPreview } from './components/LinkedInPreview';
import { BlogPreview } from './components/BlogPreview';
import { SummaryPreview } from './components/SummaryPreview';
import { ImagePreview } from './components/ImagePreview';
import { DefaultEditor } from './components/DefaultEditor';
import { Source } from './types';

export default function PlaygroundPage() {
  const [draftContent, setDraftContent] = useState(`Content creation is important for digital marketing as it involves creating and sharing various types of content to attract and engage the target audience, improve SEO, and drive traffic and conv...`);
  const [sources, setSources] = useState<Source[]>([]);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addSource = () => {
    setIsAddingSource(true);
    setNewSourceUrl('');
  };

  const handleCreateSource = () => {
    const url = newSourceUrl.trim();
    if (!url) return;

    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    const isTwitter = url.includes('twitter.com') || url.includes('x.com');
    const isGenericVideo = url.endsWith('.mp4') || url.endsWith('.webm');

    const newSource: Source = {
      id: Date.now(),
      type: isYoutube ? 'youtube' : (isTwitter ? 'tweet' : (isGenericVideo ? 'video' : 'article')),
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

  const handleGenerateContent = async () => {
    if (sources.length === 0) {
      alert("Please add at least one source (YouTube, article, tweet, etc.)");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const generatedText = data.text;

      let formattedText = generatedText;
      try {
        const parsed = JSON.parse(generatedText);
        formattedText = JSON.stringify(parsed, null, 2);
      } catch (e) {
        console.warn("Could not parse generated text as JSON");
      }

      setDraftContent(formattedText);
      localStorage.setItem("generated_content", generatedText);
      // Clear social cache to force re-generation from the new core
      localStorage.removeItem("twitter_content");
      localStorage.removeItem("linkedin_content");
    } catch (e: any) {
      console.error(e);
      alert("Failed to generate: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF] relative overflow-hidden">
      {/* Floating Left Island Navbar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden pl-32">
        {/* Editor and Preview Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FFFFFF]">
            <div className="flex-1 flex flex-col overflow-hidden p-8">
              {activeTab === 'twitter' && (
                <TwitterPreview draftContent={draftContent} setDraftContent={setDraftContent} />
              )}
              {activeTab === 'linkedin' && (
                <LinkedInPreview draftContent={draftContent} setDraftContent={setDraftContent} />
              )}
              {activeTab === 'blog' && (
                <BlogPreview draftContent={draftContent} setDraftContent={setDraftContent} />
              )}
              {activeTab === 'summary' && (
                <SummaryPreview draftContent={draftContent} setDraftContent={setDraftContent} />
              )}
              {activeTab === 'image' && (
                <ImagePreview draftContent={draftContent} setDraftContent={setDraftContent} />
              )}
              {!activeTab && (
                <DefaultEditor draftContent={draftContent} setDraftContent={setDraftContent} />
              )}
            </div>
          </div>

          {/* Sources Section */}
          <SourcesPanel
            sources={sources}
            isAddingSource={isAddingSource}
            newSourceUrl={newSourceUrl}
            expandedSource={expandedSource}
            setNewSourceUrl={setNewSourceUrl}
            setIsAddingSource={setIsAddingSource}
            handleCreateSource={handleCreateSource}
            addSource={addSource}
            removeSource={removeSource}
            toggleExpand={toggleExpand}
            onGenerate={handleGenerateContent}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
