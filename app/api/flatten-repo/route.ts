import { NextResponse } from 'next/server';
import { flattenRepo } from '@/lib/agents/repo-flattener';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await flattenRepo(body);
        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Flatten Repo Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}