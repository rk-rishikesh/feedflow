export type SourceType = 'youtube' | 'blog' | 'news' | 'tweet' | 'article' | 'pdf';

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
    linkedinContent?: string;
    blogContent?: string;
    summaryContent?: string;
    imageContent?: string;
}
