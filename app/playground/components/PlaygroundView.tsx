'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { SourcesPanel } from './SourcesPanel';
import { TwitterPreview } from './TwitterPreview';
import { LinkedInPreview } from './LinkedInPreview';
import { BlogPreview } from './BlogPreview';
import { SummaryPreview } from './SummaryPreview';
import { ImagePreview } from './ImagePreview';
import { DefaultEditor } from './DefaultEditor';
import { Source, SourceType, SavedContent } from '../types';
import { useRouter } from 'next/navigation';

interface PlaygroundViewProps {
    initialContent?: SavedContent;
}

export function PlaygroundView({ initialContent }: PlaygroundViewProps) {
    const router = useRouter();
    const [draftContent, setDraftContent] = useState(initialContent?.content || '');
    const [sources, setSources] = useState<Source[]>(initialContent?.sources || []);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedSource, setExpandedSource] = useState<number | null>(null);
    const [isAddingSource, setIsAddingSource] = useState(false);
    const [newSourceUrl, setNewSourceUrl] = useState('');
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(initialContent?.id || null);

    // Platform-specific content states
    const [twitterContent, setTwitterContent] = useState(initialContent?.twitterContent || '');
    const [linkedinContent, setLinkedinContent] = useState(initialContent?.linkedinContent || '');
    const [blogContent, setBlogContent] = useState(initialContent?.blogContent || '');
    const [summaryContent, setSummaryContent] = useState(initialContent?.summaryContent || '');
    const [imageContent, setImageContent] = useState(initialContent?.imageContent || '');

    useEffect(() => {
        setMounted(true);
    }, []);

    const updateSources = (newSources: Source[]) => {
        setSources(newSources);
        if (!currentSessionId) {
            localStorage.setItem('current_sources', JSON.stringify(newSources));
        } else {
            updateSavedSession({ sources: newSources });
        }
    };

    const updateSavedSession = (updates: Partial<SavedContent>) => {
        if (!currentSessionId) return;

        const existingContent = JSON.parse(localStorage.getItem("saved_content") || "[]");
        const updatedContent = existingContent.map((item: SavedContent) =>
            item.id === currentSessionId ? { ...item, ...updates } : item
        );
        localStorage.setItem("saved_content", JSON.stringify(updatedContent));
    };

    const handleCreateSource = () => {
        const url = newSourceUrl.trim();
        if (!url) return;

        const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
        const isPdf = url.toLowerCase().endsWith('.pdf');

        let sourceType: SourceType = 'article';
        if (isYoutube) sourceType = 'youtube';
        else if (isPdf) sourceType = 'pdf';

        const newSource: Source = {
            id: Date.now(),
            type: sourceType,
            title: url,
            url,
            author: 'Unknown',
            date: 'Just now',
        };

        const updatedSources = [newSource, ...sources];
        updateSources(updatedSources);
        setIsAddingSource(false);
        setNewSourceUrl('');
    };

    const removeSource = (id: number) => {
        const updatedSources = sources.filter((source) => source.id !== id);
        updateSources(updatedSources);
        if (expandedSource === id) {
            setExpandedSource(null);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedSource(expandedSource === id ? null : id);
        setTimeout(() => {
            const element = document.getElementById(`source-${id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 50);
    };

    const handleGenerateContent = async () => {
        if (sources.length === 0) {
            alert("Please add at least one source first.");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch("/api/gemini/orchestrate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sources: sources.map(s => ({ type: s.type, url: s.url }))
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const generatedText = data.text;
            const videoSource = sources.find(s => s.type === 'youtube') || sources[0];

            let formattedText = generatedText;
            try {
                const parsed = JSON.parse(generatedText);
                formattedText = JSON.stringify(parsed, null, 2);
            } catch (e) {
                console.warn("Could not parse generated text as JSON");
            }

            setDraftContent(formattedText);

            // Create or update session
            const sessionId = currentSessionId || Date.now();
            const newSavedContent: SavedContent = {
                id: sessionId,
                title: videoSource.title || "Untitled Project",
                content: generatedText,
                sources: sources,
                platform: activeTab || 'default',
                createdAt: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                status: 'draft',
                twitterContent: '',
                linkedinContent: '',
                blogContent: '',
                summaryContent: '',
                imageContent: ''
            };

            const existingContent = JSON.parse(localStorage.getItem("saved_content") || "[]");
            if (!currentSessionId) {
                localStorage.setItem("saved_content", JSON.stringify([newSavedContent, ...existingContent]));
                setCurrentSessionId(sessionId);
                // Redirect to the new URL without refreshing if possible, or just push
                router.push(`/playground/${sessionId}`);
            } else {
                updateSavedSession(newSavedContent);
            }

            // Reset platform contents when major core changes
            setTwitterContent('');
            setLinkedinContent('');
            setBlogContent('');
            setSummaryContent('');
            setImageContent('');

        } catch (e: any) {
            console.error(e);
            alert("Failed to generate: " + e.message);
        } finally {
            setIsGenerating(false);
        }
    };

    // Auto-save platform content changes
    useEffect(() => {
        if (currentSessionId) {
            updateSavedSession({
                twitterContent,
                linkedinContent,
                blogContent,
                summaryContent,
                imageContent,
                content: draftContent
            });
        }
    }, [twitterContent, linkedinContent, blogContent, summaryContent, imageContent, draftContent]);

    return (
        <div className="flex h-screen bg-[#FFFFFF] relative overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col overflow-hidden pl-32">
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#FFFFFF]">
                        <div className="flex-1 flex flex-col overflow-hidden p-8">
                            {activeTab === 'twitter' && (
                                <TwitterPreview
                                    draftContent={twitterContent}
                                    setDraftContent={setTwitterContent}
                                    knowledgeCore={draftContent}
                                />
                            )}
                            {activeTab === 'linkedin' && (
                                <LinkedInPreview
                                    draftContent={linkedinContent}
                                    setDraftContent={setLinkedinContent}
                                    knowledgeCore={draftContent}
                                />
                            )}
                            {activeTab === 'blog' && (
                                <BlogPreview
                                    draftContent={blogContent}
                                    setDraftContent={setBlogContent}
                                    knowledgeCore={draftContent}
                                />
                            )}
                            {activeTab === 'summary' && (
                                <SummaryPreview
                                    draftContent={summaryContent}
                                    setDraftContent={setSummaryContent}
                                    knowledgeCore={draftContent}
                                />
                            )}
                            {activeTab === 'image' && (
                                <ImagePreview
                                    draftContent={imageContent}
                                    setDraftContent={setImageContent}
                                    knowledgeCore={draftContent}
                                />
                            )}
                            {!activeTab && (
                                <DefaultEditor draftContent={draftContent} setDraftContent={setDraftContent} />
                            )}
                        </div>
                    </div>

                    <SourcesPanel
                        sources={sources}
                        isAddingSource={isAddingSource}
                        newSourceUrl={newSourceUrl}
                        expandedSource={expandedSource}
                        setNewSourceUrl={setNewSourceUrl}
                        setIsAddingSource={setIsAddingSource}
                        handleCreateSource={handleCreateSource}
                        addSource={() => setIsAddingSource(true)}
                        removeSource={removeSource}
                        toggleExpand={toggleExpand}
                        onGenerate={handleGenerateContent}
                        isGenerating={isGenerating}
                        isMounted={mounted}
                    />
                </div>
            </div>
        </div>
    );
}
