export type SourceType = 'youtube' | 'blog' | 'news' | 'tweet' | 'article' | 'github' | 'doc';

export interface Source {
    id: number;
    type: SourceType;
    title: string;
    url: string;
    thumbnail?: string;
    author?: string;
    date?: string;
    description?: string;
}

export interface Thought {
    id: string;
    type: 'initial' | 'refinement';
    text: string;
    instructions?: string;
    timestamp: string;
}

export interface SavedContent {
    id: number;
    title: string;
    content: string; // The Knowledge Core
    sources: Source[];
    platform: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | 'default';
    createdAt: string;
    status: 'draft' | 'published' | 'scheduled';
    twitterContent?: string;
    twitterThoughts?: Thought[];
    linkedinContent?: string;
    linkedinThoughts?: Thought[];
    blogContent?: string;
    blogTitle?: string;
    blogMetadata?: any;
    blogThoughts?: Thought[];
    summaryContent?: string;
    summaryThoughts?: Thought[];
    imageContent?: string;
    imageThoughts?: Thought[];
    knowledgeContext?: any;
    // Keep old fields for backward compatibility during migration if needed
    twitterThoughtProcess?: string;
    linkedinThoughtProcess?: string;
    blogThoughtProcess?: string;
    summaryThoughtProcess?: string;
    imageThoughtProcess?: string;
}
