'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const router = useRouter();

    return (
        <aside className="hidden xl:flex flex-col w-[30%] h-screen fixed right-0 top-0 px-10 py-10 overflow-hidden z-40 bg-white">
            <div className="h-full bg-white border border-[#E5E5E5] rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center p-12 text-center group">
                <div className="relative w-full aspect-square mb-8 transition-transform duration-700 group-hover:scale-105">
                    <Image
                        src="/assets/characters/one.svg"
                        alt="Agent Mascot"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="space-y-4 mb-10">
                    <h2 className="text-4xl font-black text-[#2B2B2B] tracking-tight">
                        Hi Shreyas!
                    </h2>
                    <p className="text-sm text-[#666666] leading-relaxed max-w-[240px] mx-auto">
                        Welcome home. Your specialized AI agents are ready to help you architect your next feed.
                    </p>
                </div>

                <button
                    onClick={() => router.push('/playground')}
                    className="w-full bg-[#2B2B2B] text-white rounded-3xl py-5 font-bold text-sm hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 group/btn active:scale-95"
                >
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Enter Playground
                </button>

                <div className="mt-12 flex items-center gap-3 text-[10px] font-bold text-[#D4D4D4] uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-[#F0F0F0]" />
                    Feed Flow Studio
                    <span className="w-8 h-[1px] bg-[#F0F0F0]" />
                </div>
            </div>
        </aside>
    );
}
