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

export interface SavedContent {
    id: number;
    title: string;
    content: string; // The Knowledge Core
    sources: Source[];
    platform: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | 'default';
    createdAt: string;
    status: 'draft' | 'published' | 'scheduled';
    twitterContent?: string;
    twitterPersona?: string;
    linkedinContent?: string;
    linkedinPersona?: string;
    blogContent?: string;
    blogTitle?: string;
    blogMetadata?: any;
    blogType?: string;
    blogPersona?: string;
    summaryContent?: string;
    imageContent?: string;
    knowledgeContext?: any;
}
