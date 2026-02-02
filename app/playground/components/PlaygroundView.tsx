'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { SourcesPanel } from './SourcesPanel';
import { TwitterPlayground } from './TwitterPlayground';
import { LinkedInPlayground } from './LinkedInPlayground';
import { ArticlePlayground } from './ArticlePlayground';
import { DigestPlayground } from './DigestPlayground';
import { ImagePlayground } from './ImagePlayground';
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
    const [twitterPersona, setTwitterPersona] = useState(initialContent?.twitterPersona || 'viral_hooks');

    const [linkedinContent, setLinkedinContent] = useState(initialContent?.linkedinContent || '');
    const [linkedinPersona, setLinkedinPersona] = useState(initialContent?.linkedinPersona || 'thought_leader');

    const [blogContent, setBlogContent] = useState(initialContent?.blogContent || '');
    const [blogTitle, setBlogTitle] = useState(initialContent?.blogTitle || '');
    const [blogMetadata, setBlogMetadata] = useState<any>(initialContent?.blogMetadata || null);
    const [blogType, setBlogType] = useState(initialContent?.blogType || 'informative');
    const [blogPersona, setBlogPersona] = useState(initialContent?.blogPersona || 'master_seo');

    const [summaryContent, setSummaryContent] = useState(initialContent?.summaryContent || '');
    const [imageContent, setImageContent] = useState(initialContent?.imageContent || '');
    const [knowledgeContext, setKnowledgeContext] = useState<any>(initialContent?.knowledgeContext || null);

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
        const isGithub = url.includes('github.com');
        const isDoc = url.includes('docs.') || url.includes('/docs/') || url.includes('/documentation/');

        let sourceType: SourceType = 'article';
        if (isYoutube) sourceType = 'youtube';
        else if (isGithub) sourceType = 'github';
        else if (isDoc) sourceType = 'doc';

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
    };

    const toggleExpand = (id: number) => {
        setExpandedSource(expandedSource === id ? null : id);
    };

    const handleGenerateContent = async () => {
        if (sources.length === 0) return alert("Add sources first");
        setIsGenerating(true);

        try {
            const res = await fetch('/api/gemini/orchestrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sources }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setKnowledgeContext(data.knowledgeContext);
            setSources(data.sources); // Updated sources with extracted content

            // Initial session creation logic
            if (!currentSessionId) {
                const sessionId = Date.now();
                const newSavedContent: SavedContent = {
                    id: sessionId,
                    title: data.knowledgeContext?.CoreNarrative || sources[0].title || "Untitled Project",
                    content: "",
                    sources: data.sources,
                    knowledgeContext: data.knowledgeContext,
                    platform: activeTab || 'twitter',
                    createdAt: new Date().toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }),
                    status: 'draft',
                    twitterContent: '',
                    twitterPersona: 'viral_hooks',
                    linkedinContent: '',
                    linkedinPersona: 'thought_leader',
                    blogContent: '',
                    blogTitle: '',
                    blogMetadata: null,
                    blogType: 'informative',
                    blogPersona: 'master_seo',
                    summaryContent: '',
                    imageContent: ''
                };

                const existingContent = JSON.parse(localStorage.getItem("saved_content") || "[]");
                localStorage.setItem("saved_content", JSON.stringify([newSavedContent, ...existingContent]));
                setCurrentSessionId(sessionId);
                router.push(`/playground/${sessionId}`);
            } else {
                updateSavedSession({
                    knowledgeContext: data.knowledgeContext,
                    sources: data.sources
                });
            }
        } catch (e: any) {
            console.error(e);
            alert("Failed to orchestrate: " + e.message);
        } finally {
            setIsGenerating(false);
        }
    };

    // Auto-save changes
    useEffect(() => {
        if (currentSessionId) {
            updateSavedSession({
                twitterContent, twitterPersona,
                linkedinContent, linkedinPersona,
                blogContent, blogTitle, blogMetadata, blogType, blogPersona,
                summaryContent, imageContent,
                content: draftContent,
                sources,
                knowledgeContext
            });
        }
    }, [twitterContent, twitterPersona, linkedinContent, linkedinPersona, blogContent, blogTitle, blogMetadata, blogType, blogPersona, summaryContent, imageContent, draftContent, sources]);

    return (
        <div className="flex h-screen bg-[#FFFFFF] relative overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col overflow-hidden pl-32">
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#FFFFFF]">
                        <div className="flex-1 flex flex-col overflow-hidden p-8">
                            {activeTab === 'twitter' && (
                                <TwitterPlayground
                                    sources={sources}
                                    draftContent={twitterContent}
                                    setDraftContent={setTwitterContent}
                                    persona={twitterPersona}
                                    setPersona={setTwitterPersona}
                                    knowledgeContext={knowledgeContext}
                                />
                            )}
                            {activeTab === 'linkedin' && (
                                <LinkedInPlayground
                                    sources={sources}
                                    draftContent={linkedinContent}
                                    setDraftContent={setLinkedinContent}
                                    persona={linkedinPersona}
                                    setPersona={setLinkedinPersona}
                                    knowledgeContext={knowledgeContext}
                                />
                            )}
                            {activeTab === 'blog' && (
                                <ArticlePlayground
                                    sources={sources}
                                    draftContent={blogContent}
                                    setDraftContent={setBlogContent}
                                    title={blogTitle}
                                    setTitle={setBlogTitle}
                                    metadata={blogMetadata}
                                    setMetadata={setBlogMetadata}
                                    persona={blogPersona}
                                    setPersona={setBlogPersona}
                                    articleType={blogType}
                                    setArticleType={setBlogType}
                                    knowledgeContext={knowledgeContext}
                                />
                            )}
                            {activeTab === 'summary' && (
                                <DigestPlayground
                                    sources={sources}
                                    draftContent={summaryContent}
                                    setDraftContent={setSummaryContent}
                                    knowledgeContext={knowledgeContext}
                                />
                            )}
                            {activeTab === 'image' && (
                                <ImagePlayground
                                    sources={sources}
                                    draftContent={imageContent}
                                    setDraftContent={setImageContent}
                                    knowledgeContext={knowledgeContext}
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
