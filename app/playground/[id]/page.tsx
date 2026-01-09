'use client';

import { use, useEffect, useState } from 'react';
import { PlaygroundView } from '../components/PlaygroundView';
import { SavedContent } from '../types';
import { useRouter } from 'next/navigation';

export default function SavedPlaygroundPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [initialContent, setInitialContent] = useState<SavedContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('saved_content');
            if (saved) {
                try {
                    const contents = JSON.parse(saved);
                    const found = contents.find((item: SavedContent) => item.id.toString() === id);
                    if (found) {
                        setInitialContent(found);
                    } else {
                        console.error("Session not found");
                        router.push('/playground');
                    }
                } catch (e) {
                    console.error("Failed to parse saved content", e);
                    router.push('/playground');
                }
            } else {
                router.push('/playground');
            }
            setLoading(false);
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FFFFFF]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B2B2B]"></div>
            </div>
        );
    }

    return <PlaygroundView initialContent={initialContent || undefined} />;
}
