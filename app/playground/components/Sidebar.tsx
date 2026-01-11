import { useRouter } from 'next/navigation';

interface SidebarProps {
    activeTab: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null;
    setActiveTab: (tab: 'twitter' | 'linkedin' | 'blog' | 'summary' | 'image' | null) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const router = useRouter();

    return (
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50">
            <nav className="bg-[#2B2B2B] border border-[#B3B3B3] rounded-full px-6 py-8 shadow-lg flex flex-col items-center gap-8">

                <button
                    onClick={() => router.push('/')}
                    className="flex flex-col items-center gap-2 text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>

                <button
                    onClick={() => setActiveTab('twitter')}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'twitter' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
                >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveTab('linkedin')}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'linkedin' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
                >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'blog' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'summary' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveTab('image')}
                    className={`flex flex-col items-center gap-2 transition-colors ${activeTab === 'image' ? 'text-[#FFFFFF]' : 'text-[#D4D4D4] hover:text-[#FFFFFF]'}`}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>

                <button
                    onClick={() => router.push('/home')}
                    className="flex flex-col items-center gap-2 text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
                <button
                    onClick={() => router.back()}
                    className="flex flex-col items-center gap-2 text-[#D4D4D4] hover:text-[#FFFFFF] transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            </nav>
        </div>
    );
}
