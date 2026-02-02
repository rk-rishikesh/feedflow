'use client';

import { useState } from 'react';
import PersonaProgress from './PersonaProgress';
import PluginItem from './PluginItem';

interface SidebarProps {
    avatarUrl: string;
}

export default function Sidebar({ avatarUrl }: SidebarProps) {
    const [connections, setConnections] = useState<Record<string, string>>({
        'twitter': 'x.com/shreyas_designs'
    });

    const handleConnect = (id: string, value: string) => {
        setConnections(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const calculateProgress = () => {
        const totalPossible = 4; // Logo, Figma, X, LinkedIn
        const connected = Object.keys(connections).length;
        return Math.min(100, Math.round((connected / totalPossible) * 100));
    };

    return (
        <aside className="hidden xl:flex flex-col w-[30%] h-screen fixed right-0 top-0 px-10 py-10 overflow-hidden z-40 bg-white">
            <div className="h-full bg-white border border-[#E5E5E5] rounded-[2.5rem] shadow-xl flex flex-col p-8 overflow-y-auto no-scrollbar">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-[#2B2B2B] mb-2">User Persona</h2>
                    <p className="text-sm text-[#666666]">Configure your brand identity and voice to train your personal AI agents.</p>
                </div>

                {/* Modular Progress Component */}
                <PersonaProgress
                    progress={calculateProgress()}
                    avatarUrl={avatarUrl}
                />

                {/* Plugins Section */}
                <div className="space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-[10px] font-bold text-[#B3B3B3] uppercase tracking-widest">Identity Assets</h3>
                            <div className="h-[1px] flex-1 bg-[#F0F0F0] ml-4"></div>
                        </div>

                        <div className="space-y-1">
                            <PluginItem
                                id="brand-logo"
                                title="Brand Logo"
                                subtitle="Link your primary vector logo"
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
                                        <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                                isConnected={!!connections['brand-logo']}
                                connectedValue={connections['brand-logo']}
                                onConnect={(val) => handleConnect('brand-logo', val)}
                            />

                            <PluginItem
                                id="figma"
                                title="Figma Kit"
                                subtitle="Connect your design system"
                                activeColor="#F24E1E"
                                icon={
                                    <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 28.5C19 25.9834 20.0009 23.5698 21.7825 21.7882C23.5641 20.0065 25.9777 19.0057 28.5 19.0057C31.0223 19.0057 33.4359 20.0065 35.2175 21.7882C36.9991 23.5698 38 25.9834 38 28.5C38 31.0166 36.9991 33.4302 35.2175 35.2118C33.4359 36.9935 31.0223 37.9943 28.5 37.9943C25.9777 37.9943 23.5641 36.9935 21.7825 35.2118C20.0009 33.4302 19 31.0166 19 28.5Z" fill="currentColor" />
                                        <path d="M0 47.4943C0 44.9777 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.97772 37.9943 9.5 37.9943C12.0223 37.9943 14.4359 39.0009 16.2175 40.7825C17.9991 42.5641 19 44.9777 19 47.4943C19 50.0109 17.9991 52.4245 16.2175 54.2061C14.4359 55.9877 12.0223 56.9886 9.5 56.9886C6.97772 56.9886 4.56408 55.9877 2.78249 54.2061C1.00089 52.4245 0 50.0109 0 47.4943Z" fill="#0ACF83" />
                                        <path d="M19 0H28.5C31.0223 0 33.4359 1.00089 35.2175 2.78249C36.9991 4.56408 38 6.97772 38 9.5C38 12.0223 36.9991 14.4359 35.2175 16.2175C33.4359 17.9991 31.0223 19 28.5 19H19V0Z" fill="#FF7262" />
                                        <path d="M0 9.5C0 6.97772 1.00089 4.56408 2.78249 2.78249C4.56408 1.00089 6.97772 0 9.5 0C12.0223 0 14.4359 1.00089 16.2175 2.78249C17.9991 4.56408 19 6.97772 19 9.5V19H9.5C6.97772 19 4.56408 17.9991 2.78249 16.2175C1.00089 14.4359 0 12.0223 0 9.5Z" fill="#F24E1E" />
                                        <path d="M0 28.5C0 25.9834 1.00089 23.5698 2.78249 21.7882C4.56408 20.0065 6.97772 19.0057 9.5 19.0057C12.0223 19.0057 14.4359 20.0065 16.2175 21.7882C17.9991 23.5698 19 25.9834 19 28.5V38H9.5C6.97772 38 4.56408 36.9991 2.78249 35.2175C1.00089 33.4359 0 31.0166 0 28.5Z" fill="#A259FF" />
                                    </svg>
                                }
                                isConnected={!!connections['figma']}
                                connectedValue={connections['figma']}
                                onConnect={(val) => handleConnect('figma', val)}
                            />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-[10px] font-bold text-[#B3B3B3] uppercase tracking-widest">Social Context</h3>
                            <div className="h-[1px] flex-1 bg-[#F0F0F0] ml-4"></div>
                        </div>

                        <div className="space-y-1">
                            <PluginItem
                                id="twitter"
                                title="X / Twitter"
                                subtitle="Analyze your writing style"
                                activeColor="#000000"
                                icon={
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.576a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                }
                                isConnected={!!connections['twitter']}
                                connectedValue={connections['twitter']}
                                onConnect={(val) => handleConnect('twitter', val)}
                            />

                            <PluginItem
                                id="linkedin"
                                title="LinkedIn"
                                subtitle="Import professional history"
                                activeColor="#0077B5"
                                icon={
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                }
                                isConnected={!!connections['linkedin']}
                                connectedValue={connections['linkedin']}
                                onConnect={(val) => handleConnect('linkedin', val)}
                            />
                        </div>
                    </section>
                </div>

                <div className="mt-auto pt-10">
                    <button className="w-full bg-[#2B2B2B] text-white rounded-2xl py-4 font-bold text-sm hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-[0.98]">
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Process Persona with AI
                    </button>
                    <p className="text-[10px] text-[#A3A3A3] text-center mt-4">
                        AI agents will use this data to personalize your feeds and generated content.
                    </p>
                </div>
            </div>
        </aside>
    );
}
