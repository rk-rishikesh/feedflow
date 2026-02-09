'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 min-h-screen flex flex-col">
        {/* FEED FLOW Title */}
        <div className="flex justify-center pt-8 md:pt-4">
          <h1 className="font-bold text-[#2B2B2B] tracking-[0.01em] leading-none text-[12vw] sm:text-[100px] md:text-[130px] lg:text-[160px]">
            RIZZ NETWORK
          </h1>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mt-4 px-6 lg:px-11 gap-8 lg:gap-64">
          {/* Navigation Bar - Left */}
          <div className="bg-[#2B2B2B] rounded-full px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-center gap-4 lg:gap-6 min-w-full sm:min-w-[350px] lg:min-w-[400px]">
            <span className="text-white font-semibold text-xs sm:text-sm lg:text-base xl:text-lg">GENERATE</span>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span className="text-white font-semibold text-xs sm:text-sm lg:text-base xl:text-lg">DRAFT</span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-white shrink-0">
              <path d="M4 0L8 4L4 8L0 4L4 0Z" fill="white" transform="rotate(45 4 4)" />
            </svg>
            <span className="text-white font-semibold text-xs sm:text-sm lg:text-base xl:text-lg">POST</span>
          </div>

          {/* Text - Extreme Right */}
          <div className="text-[#888888] font-medium leading-relaxed uppercase text-[10px] tracking-[0.4em] max-w-xl text-center lg:text-left">
            From YouTube transcripts and GitHub repos to complex PDFs.
            <br className="hidden sm:block" />
            Our multi-agent orchestration layer filters the noise to pipeline high-signal intelligence into content with <span className="italic text-[#2B2B2B] font-bold">peak Rizz</span>.
          </div>
        </div>

        {/* Bottom Section with Character */}
        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-end justify-between px-6 lg:px-11 pb-16 lg:pb-24 w-full gap-12 lg:gap-0">

          <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[448px] xl:h-[448px] lg:-mt-12 transition-all duration-500 hover:scale-110 hover:-rotate-6 hover:drop-shadow-2xl cursor-pointer">
            <Image
              src="/assets/characters/three.svg"
              alt="Character"
              width={448}
              height={448}
              className="object-contain w-full h-full transition-transform duration-500"
              priority
            />
          </div>

          <div
            className="bg-[#2B2B2B] rounded-full px-6 py-3 flex items-center gap-4 w-fit lg:mb-32 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#2B2B2B]/30"
            onClick={() => router.push('/home')}
          >
            <span className="text-white font-bold text-base lg:text-lg xl:text-xl transition-all duration-300">
              Rizz My Sources
            </span>
            <button className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </div>

        {/* Middle Section - How it Works */}
        <div className="w-full py-16 lg:py-32 px-6 lg:px-11 relative overflow-hidden">
          {/* Background Path (Dotted Line) */}
          <div className="absolute top-[60%] left-0 w-full h-40 pointer-events-none opacity-20 hidden lg:block">
            <svg width="100%" height="100%" viewBox="0 0 1200 120" fill="none" preserveAspectRatio="none">
              <path
                d="M0 60C150 60 150 10 300 10C450 10 450 110 600 110C750 110 750 10 900 10C1050 10 1050 60 1200 60"
                stroke="#2B2B2B"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B2B2B] tracking-tight mb-6">How it works</h2>
              <p className="max-w-2xl mx-auto text-[#888888] font-medium leading-relaxed uppercase text-[10px] tracking-[0.4em]">
                Your intelligence pipeline from raw noise to high-impact signals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-full aspect-[4/3] bg-white border border-[#F0F0F0] rounded-[32px] mb-8 relative flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col gap-2 w-3/4">
                    <div className="h-6 w-full bg-[#F5F5F5] rounded-full animate-pulse" />
                    <div className="h-6 w-2/3 bg-[#F0F0F0] rounded-full" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-[#2B2B2B] rounded-lg shrink-0" />
                      <div className="h-8 w-8 bg-[#E5E5E5] rounded-lg shrink-0" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-black text-[#2B2B2B] mb-2">Feed the Beast.</h4>
                <p className="text-[10px] text-[#B3B3B3] font-bold uppercase tracking-widest leading-relaxed">
                  Drop your links, PDFs, youtube videos <br />or github repositories.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group lg:mt-16">
                <div className="w-full aspect-[4/3] bg-white border border-[#F0F0F0] rounded-[32px] mb-8 relative flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 grid grid-cols-2 gap-2 p-6 w-full">
                    <div className="h-10 border border-[#F0F0F0] rounded-xl flex items-center justify-center text-[10px] font-black group-hover:bg-black group-hover:text-white transition-colors">X</div>
                    <div className="h-10 border border-[#F0F0F0] rounded-xl flex items-center justify-center text-[10px] font-black group-hover:bg-black group-hover:text-white transition-colors">LINKEDIN</div>
                    <div className="h-10 border border-[#F0F0F0] rounded-xl flex items-center justify-center text-[10px] font-black group-hover:bg-black group-hover:text-white transition-colors">ARTICLE</div>
                    <div className="h-10 border border-[#F0F0F0] rounded-xl flex items-center justify-center text-[10px] font-black group-hover:bg-black group-hover:text-white transition-colors">DIGEST</div>
                  </div>
                </div>
                <h4 className="text-lg font-black text-[#2B2B2B] mb-2">Pick the type.</h4>
                <p className="text-[10px] text-[#B3B3B3] font-bold uppercase tracking-widest leading-relaxed">
                  Choose from X, Linkedin,<br />Digest, Article, or Image
                </p>
              </div>

              {/* Step 3 (New) */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-full aspect-[4/3] bg-white border border-[#F0F0F0] rounded-[32px] mb-8 relative flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 w-3/4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600" />
                      <div className="h-3 w-1/2 bg-[#F5F5F5] rounded-full" />
                    </div>
                    <div className="p-3 bg-[#F9F9F9] rounded-2xl border border-[#F0F0F0]">
                      <div className="h-2 w-full bg-[#E5E5E5] rounded-full mb-2" />
                      <div className="h-2 w-3/4 bg-[#E5E5E5] rounded-full" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-black text-[#2B2B2B] mb-2">Refine content.</h4>
                <p className="text-[10px] text-[#B3B3B3] font-bold uppercase tracking-widest leading-relaxed">
                  Give instructions to<br />perfect your POV.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group lg:mt-16">
                <div className="w-full aspect-[4/3] bg-white border border-[#F0F0F0] rounded-[32px] mb-8 relative flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
                  <div className="relative w-3/4 space-y-2">
                    <div className="h-4 w-full bg-[#2B2B2B] rounded shadow-lg shadow-black/20" />
                    <div className="h-4 w-3/4 bg-[#2B2B2B] rounded" />
                    <div className="h-4 w-1/2 bg-[#2B2B2B]/10 rounded" />
                  </div>
                </div>
                <h4 className="text-lg font-black text-[#2B2B2B] mb-2">Get the Rizz.</h4>
                <p className="text-[10px] text-[#B3B3B3] font-bold uppercase tracking-widest leading-relaxed">
                  Watch your sources turn into<br />polished threads in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="w-full mt-16 px-4 lg:px-8">
          {/* Header Text */}
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B2B2B] tracking-tight mb-6">Intelligence Pipeline</h2>
            <p className="max-w-3xl mx-auto text-[#888888] font-medium leading-relaxed uppercase text-[10px] tracking-[0.4em]">
              Reasoning through repositories, transcripts, and docs <br className="hidden sm:block" />
              to architect high-velocity content with <span className="italic text-[#2B2B2B] font-bold">peak Rizz</span>.
            </p>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-5 gap-3 lg:gap-4 justify-items-center max-w-5xl mx-auto">
            {/* Row 1 - 4 characters with empty space on left */}
            <div></div>
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/one.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div className="bg-[#B3B3B3] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/two.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </div>
            <div></div>
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/four.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>

            {/* Row 2 - 5 characters (full row) */}
            <div className="bg-[#B3B3B3] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/five.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </div>
            <div></div>
            <div></div>
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/eight.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div className="bg-[#B3B3B3] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/nine.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </div>

            {/* Row 3 - 4 characters with empty space on right */}
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/ten.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div className="bg-[#B3B3B3] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/eleven.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </div>
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/twelve.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div></div>
            <div className="bg-[#B3B3B3] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/one.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </div>
            <div></div>

            {/* Row 4 - 3 characters with empty spaces on both sides */}
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/two.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div className="bg-[#B3B3B3] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/three.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            </div>
            <div className="bg-[#D4D4D4] rounded-2xl p-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center group cursor-pointer">
              <Image src="/assets/characters/four.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
            </div>
            <div></div>
          </div>
        </div>

      </div>

      {/* Section 3 - Footer */}
      <footer className="w-full bg-gradient-to-t from-[#D4D4D4] to-[#FFFFFF] pt-24 pb-8 px-6 lg:px-24 text-[#2B2B2B]">
        <div className="w-full mx-auto">

          {/* Massive Title */}
          <div className="py-6 md:py-12 overflow-hidden select-none flex items-center justify-center">
            <h1 className="mb-2 text-[12vw] md:text-[11.5vw] font-black leading-none tracking-[-0.05em] text-[#2B2B2B] whitespace-nowrap -mb-8 md:-mb-12 text-center w-full">
              RIZZ NETWORK
            </h1>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#2B2B2B]/10 gap-4 sm:gap-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
              ©{new Date().getFullYear()} RIZZ NETWORK
            </span>
            <a
              href="https://x.com/rizznetwork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors"
            >
              Follow us on X <span className="text-sm">↗</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
