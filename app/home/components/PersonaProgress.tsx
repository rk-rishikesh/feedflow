'use client';

import Image from 'next/image';

interface PersonaProgressProps {
    progress: number;
    avatarUrl: string;
}

export default function PersonaProgress({ progress, avatarUrl }: PersonaProgressProps) {
    // Calculate stroke-dashoffset for circular progress
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="mb-10 p-6 bg-[#F9F9F9] rounded-[2rem] border border-[#EEEEEE] relative overflow-hidden group">
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 shrink-0">
                    {/* Circular Progress Path */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="#E5E5E5"
                            strokeWidth="4"
                            fill="transparent"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="#2B2B2B"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Avatar Image */}
                    <div className="absolute inset-2 overflow-hidden rounded-full border-2 border-white shadow-inner bg-white">
                        <Image
                            src={avatarUrl}
                            alt="AI Persona Avatar"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>

                    {/* Progress Percentage Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-[#2B2B2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                        {progress}%
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#2B2B2B] mb-1">Character Persona</h3>
                    <p className="text-[11px] text-[#666666] leading-relaxed">
                        Your AI is currently <span className="font-bold text-[#2B2B2B]">{progress}%</span> trained. Add assets to sharpen its edge.
                    </p>
                    <div className="mt-3 flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full ${i <= (progress / 20) ? 'bg-[#2B2B2B]' : 'bg-[#E5E5E5]'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#2B2B2B]/5 rounded-full blur-2xl group-hover:bg-[#2B2B2B]/10 transition-colors"></div>
        </div>
    );
}
