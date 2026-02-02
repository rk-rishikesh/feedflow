'use client';

import { useState } from 'react';

interface PluginItemProps {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    activeColor?: string;
    onConnect: (value: string) => void;
    isConnected?: boolean;
    connectedValue?: string;
}

export default function PluginItem({
    id,
    title,
    subtitle,
    icon,
    activeColor = '#2B2B2B',
    onConnect,
    isConnected,
    connectedValue
}: PluginItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState(connectedValue || '');

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onConnect(inputValue);
            setIsExpanded(false);
        }
    };

    return (
        <div className="group border-b border-[#F0F0F0] last:border-0 pb-4 last:pb-0">
            <div
                onClick={() => !isConnected && setIsExpanded(!isExpanded)}
                className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center gap-4 ${isConnected ? 'bg-[#F9F9F9]' : 'hover:bg-[#F5F5F5]'
                    }`}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                        backgroundColor: isConnected ? activeColor : '#F5F5F5',
                        color: isConnected ? 'white' : activeColor
                    }}
                >
                    {icon}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#2B2B2B]">{title}</h4>
                    <p className="text-[10px] text-[#666666] truncate">
                        {isConnected ? connectedValue : subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-green-600">Active</span>
                        </div>
                    ) : (
                        <div
                            className={`w-6 h-6 rounded-full border border-[#E5E5E5] flex items-center justify-center transition-all ${isExpanded ? 'rotate-45 bg-[#2B2B2B] border-[#2B2B2B] text-white' : 'group-hover:border-[#2B2B2B]'
                                }`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && !isConnected && (
                <div className="mt-3 px-4 animate-in slide-in-from-top-2 duration-300">
                    <form onSubmit={handleConnect} className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder={`Paste ${title.toLowerCase()} link...`}
                                className="w-full bg-[#F5F5F5] border-none outline-none px-4 py-2.5 rounded-xl text-xs text-[#2B2B2B] placeholder-[#A3A3A3] focus:ring-1 focus:ring-[#2B2B2B] transition-all"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#2B2B2B] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md shadow-black/5"
                        >
                            Link
                        </button>
                    </form>
                    <p className="text-[9px] text-[#A3A3A3] mt-2 px-1">
                        We'll analyze this to personalize your generations.
                    </p>
                </div>
            )}
        </div>
    );
}
