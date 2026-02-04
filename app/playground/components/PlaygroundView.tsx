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
import { Source, SourceType, SavedContent, Thought } from '../types';
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
    const [isRefining, setIsRefining] = useState(false);
    const [refinementInstructions, setRefinementInstructions] = useState('');

    // Platform-specific content states
    const [twitterContent, setTwitterContent] = useState(initialContent?.twitterContent || '');
    const [twitterThoughts, setTwitterThoughts] = useState<Thought[]>(initialContent?.twitterThoughts || (initialContent?.twitterThoughtProcess ? [{ id: 'init', type: 'initial', text: initialContent.twitterThoughtProcess, timestamp: new Date().toISOString() }] : []));

    const [linkedinContent, setLinkedinContent] = useState(initialContent?.linkedinContent || '');
    const [linkedinThoughts, setLinkedinThoughts] = useState<Thought[]>(initialContent?.linkedinThoughts || (initialContent?.linkedinThoughtProcess ? [{ id: 'init', type: 'initial', text: initialContent.linkedinThoughtProcess, timestamp: new Date().toISOString() }] : []));

    const [blogContent, setBlogContent] = useState(initialContent?.blogContent || '');
    const [blogTitle, setBlogTitle] = useState(initialContent?.blogTitle || '');
    const [blogMetadata, setBlogMetadata] = useState<any>(initialContent?.blogMetadata || null);
    const [blogThoughts, setBlogThoughts] = useState<Thought[]>(initialContent?.blogThoughts || (initialContent?.blogThoughtProcess ? [{ id: 'init', type: 'initial', text: initialContent.blogThoughtProcess, timestamp: new Date().toISOString() }] : []));

    const [summaryContent, setSummaryContent] = useState(initialContent?.summaryContent || '');
    const [summaryThoughts, setSummaryThoughts] = useState<Thought[]>(initialContent?.summaryThoughts || (initialContent?.summaryThoughtProcess ? [{ id: 'init', type: 'initial', text: initialContent.summaryThoughtProcess, timestamp: new Date().toISOString() }] : []));

    const [imageContent, setImageContent] = useState(initialContent?.imageContent || '');
    const [imageThoughts, setImageThoughts] = useState<Thought[]>(initialContent?.imageThoughts || (initialContent?.imageThoughtProcess ? [{ id: 'init', type: 'initial', text: initialContent.imageThoughtProcess, timestamp: new Date().toISOString() }] : []));

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
            setSources(data.sources);

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
                    twitterThoughtProcess: '',
                    linkedinContent: '',
                    linkedinThoughtProcess: '',
                    blogContent: '',
                    blogTitle: '',
                    blogMetadata: null,
                    blogThoughtProcess: '',
                    summaryContent: '',
                    summaryThoughtProcess: '',
                    imageContent: '',
                    imageThoughtProcess: ''
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

    const handleRefine = async (instructions: string) => {
        if (!activeTab || !instructions.trim()) return;
        setIsRefining(true);

        // Determine what content to refine
        let originalContent: any = '';
        let originalThought = '';

        switch (activeTab) {
            case 'twitter':
                originalContent = twitterContent;
                originalThought = twitterThoughts[twitterThoughts.length - 1]?.text || '';
                break;
            case 'linkedin':
                originalContent = linkedinContent;
                originalThought = linkedinThoughts[linkedinThoughts.length - 1]?.text || '';
                break;
            case 'blog':
                originalContent = blogContent;
                originalThought = blogThoughts[blogThoughts.length - 1]?.text || '';
                break;
            case 'summary':
                originalContent = summaryContent;
                originalThought = summaryThoughts[summaryThoughts.length - 1]?.text || '';
                break;
            case 'image':
                originalContent = imageContent;
                originalThought = imageThoughts[imageThoughts.length - 1]?.text || '';
                break;
        }

        try {
            const res = await fetch('/api/gemini/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: activeTab,
                    originalContent,
                    originalThought,
                    knowledgeContext,
                    instructions
                }),
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            const newThought: Thought = {
                id: Date.now().toString(),
                type: 'refinement',
                text: data.thoughtProcess,
                instructions: instructions,
                timestamp: new Date().toISOString()
            };

            // Update state based on platform
            switch (activeTab) {
                case 'twitter':
                    setTwitterContent(Array.isArray(data.updatedContent) ? data.updatedContent.join('\n\n---\n\n') : data.updatedContent);
                    setTwitterThoughts(prev => [...prev, newThought]);
                    break;
                case 'linkedin':
                    setLinkedinContent(data.updatedContent);
                    setLinkedinThoughts(prev => [...prev, newThought]);
                    break;
                case 'blog':
                    setBlogContent(data.updatedContent);
                    setBlogThoughts(prev => [...prev, newThought]);
                    if (data.metadata?.title) setBlogTitle(data.metadata.title);
                    break;
                case 'summary':
                    setSummaryContent(data.updatedContent);
                    setSummaryThoughts(prev => [...prev, newThought]);
                    break;
                case 'image':
                    setImageContent(data.updatedContent);
                    setImageThoughts(prev => [...prev, newThought]);
                    break;
            }

            setRefinementInstructions('');
            alert("Refinement complete. Check the updated content.");
        } catch (e: any) {
            console.error(e);
            alert("Refinement failed: " + e.message);
        } finally {
            setIsRefining(false);
        }
    };

    useEffect(() => {
        if (currentSessionId) {
            updateSavedSession({
                twitterContent, twitterThoughts,
                linkedinContent, linkedinThoughts,
                blogContent, blogTitle, blogMetadata, blogThoughts,
                summaryContent, summaryThoughts,
                imageContent, imageThoughts,
                content: draftContent,
                sources,
                knowledgeContext
            });
        }
    }, [twitterContent, twitterThoughts, linkedinContent, linkedinThoughts, blogContent, blogTitle, blogMetadata, blogThoughts, summaryContent, summaryThoughts, imageContent, imageThoughts, draftContent, sources]);

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
                                    thoughts={twitterThoughts}
                                    setThoughts={setTwitterThoughts}
                                    knowledgeContext={knowledgeContext}
                                    isProcessing={isRefining}
                                />
                            )}
                            {activeTab === 'linkedin' && (
                                <LinkedInPlayground
                                    sources={sources}
                                    draftContent={linkedinContent}
                                    setDraftContent={setLinkedinContent}
                                    thoughts={linkedinThoughts}
                                    setThoughts={setLinkedinThoughts}
                                    knowledgeContext={knowledgeContext}
                                    isProcessing={isRefining}
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
                                    thoughts={blogThoughts}
                                    setThoughts={setBlogThoughts}
                                    knowledgeContext={knowledgeContext}
                                    isProcessing={isRefining}
                                />
                            )}
                            {activeTab === 'summary' && (
                                <DigestPlayground
                                    sources={sources}
                                    draftContent={summaryContent}
                                    setDraftContent={setSummaryContent}
                                    thoughts={summaryThoughts}
                                    setThoughts={setSummaryThoughts}
                                    knowledgeContext={knowledgeContext}
                                    isProcessing={isRefining}
                                />
                            )}
                            {activeTab === 'image' && (
                                <ImagePlayground
                                    sources={sources}
                                    draftContent={imageContent}
                                    setDraftContent={setImageContent}
                                    thoughts={imageThoughts}
                                    setThoughts={setImageThoughts}
                                    knowledgeContext={knowledgeContext}
                                    isProcessing={isRefining}
                                />
                            )}
                            {!activeTab && (
                                <DefaultEditor
                                    draftContent={draftContent}
                                    setDraftContent={setDraftContent}
                                    isGenerating={isGenerating}
                                    knowledgeContext={knowledgeContext}
                                />
                            )}
                        </div>
                    </div>

                    <SourcesPanel
                        sources={sources}
                        isAddingSource={isAddingSource}
                        newSourceUrl={newSourceUrl}
                        expandedSource={expandedSource}
                        activeTab={activeTab}
                        setNewSourceUrl={setNewSourceUrl}
                        setIsAddingSource={setIsAddingSource}
                        handleCreateSource={handleCreateSource}
                        addSource={() => setIsAddingSource(true)}
                        removeSource={removeSource}
                        toggleExpand={toggleExpand}
                        onGenerate={handleGenerateContent}
                        onRefine={handleRefine}
                        isGenerating={isGenerating}
                        isRefining={isRefining}
                        isMounted={mounted}
                        refinementInstructions={refinementInstructions}
                        setRefinementInstructions={setRefinementInstructions}
                    />
                </div>
            </div>
        </div>
    );
}
