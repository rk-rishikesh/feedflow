export type SourceType = 'youtube' | 'blog' | 'news' | 'tweet' | 'article';

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
