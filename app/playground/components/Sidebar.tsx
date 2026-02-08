import { useRouter } from 'next/navigation';

interface SidebarProps {
    activeTab: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null;
    setActiveTab: (tab: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {

    const router = useRouter();

    const agents = [
        {
            id: 'twitter', label: 'X Agent', icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
                </svg>
            )
        },
        {
            id: 'linkedin', label: 'LinkedIn Agent', icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            id: 'blog', label: 'Article Agent', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            id: 'summary', label: 'Digest Agent', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            id: 'image', label: 'Visual Agent', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
    ];

    return (
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50">
            <nav className="bg-[#1A1A1A] border border-[#333333] rounded-3xl px-3 py-6 shadow-2xl flex flex-col items-center gap-6 backdrop-blur-sm bg-opacity-95">

                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-2xl text-[#888888] hover:text-white hover:bg-[#333333] transition-all group relative"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#333333]">Home</span>
                </button>

                <div className="w-8 h-[1px] bg-[#333333]" />

                {/* Knowledge Graph Button */}
                <button
                    onClick={() => setActiveTab(null)}
                    className={`p-3 rounded-2xl transition-all group relative ${activeTab === null
                        ? 'bg-[#FFFFFF] text-[#000000] shadow-glow scale-110'
                        : 'text-[#888888] hover:text-white hover:bg-[#333333]'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#333333]">Knowledge Graph</span>
                </button>

                {agents.map((agent) => (
                    <button
                        key={agent.id}
                        onClick={() => setActiveTab(agent.id as any)}
                        className={`p-3 rounded-2xl transition-all group relative ${activeTab === agent.id
                            ? 'bg-[#FFFFFF] text-[#000000] shadow-glow scale-110'
                            : 'text-[#888888] hover:text-white hover:bg-[#333333]'
                            }`}
                    >
                        {agent.icon}
                        <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#333333]">
                            {agent.label}
                        </span>
                    </button>
                ))}

                <div className="w-8 h-[1px] bg-[#333333]" />

                <button
                    onClick={() => router.push('/home')}
                    className="p-3 rounded-2xl text-[#888888] hover:text-white hover:bg-[#333333] transition-all group relative"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#333333]">Profile</span>
                </button>
            </nav>

            <style jsx>{`
                .shadow-glow {
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
