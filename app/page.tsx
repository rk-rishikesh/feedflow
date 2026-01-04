import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F5ED] p-4 lg:p-2">
      <div className="max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* FEED FLOW Title */}
        <div className="flex justify-center pt-4">
          <h1 className="font-bold text-[#F7A83B] tracking-[0.01em] leading-none text-[200px]">
            FEED FLOW
          </h1>
        </div>
        
        {/* Middle Section */}
        <div className="flex justify-between items-start mt-4 px-11 gap-64">
          {/* Navigation Bar - Left */}
          <div className="bg-[#F7A83B] rounded-full px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-center gap-4 lg:gap-6 min-w-[300px] lg:min-w-[400px]">
            <span className="text-white font-semibold text-sm lg:text-base xl:text-lg">GENERATE</span>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span className="text-white font-semibold text-sm lg:text-base xl:text-lg">DRAFT</span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-white">
              <path d="M4 0L8 4L4 8L0 4L4 0Z" fill="white" transform="rotate(45 4 4)"/>
            </svg>
            <span className="text-white font-semibold text-sm lg:text-base xl:text-lg">POST</span>
          </div>
          
          {/* Text - Extreme Right */}
          <div className="text-black text-base lg:text-lg xl:text-xl">
          Multiply your digital footprint by transforming any content into high-impact social campaigns.
          </div>
        </div>
       
        {/* Bottom Section with Character */}
        <div className="flex-1 flex items-end justify-between px-11 pb-24 w-full">
          
          <div className="w-80 h-80 lg:w-96 lg:h-96 xl:w-[448px] xl:h-[448px] -mt-12">
            <Image
              src="/assets/characters/three.svg"
              alt="Character"
              width={448}
              height={448}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          <div className="bg-[#F7A83B] rounded-full px-6 py-3 flex items-center gap-4 w-fit mb-8">
            <span className="text-white font-bold text-base lg:text-lg xl:text-xl">
              Generate Your Post
            </span>
            <button className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        
        </div>
        {/* Section 2 */}
        <div className="w-full mt-16 px-4 lg:px-8">
          {/* Header Text */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#2C2C2C] mb-2 tracking-wide">
              The 'Scroll & Read' Revolution is here.
            </h2>
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#2C2C2C] mb-2 tracking-wide">
              Endless Short Stories,
            </h3>
            <p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-[#2C2C2C] tracking-wide">
              Comics powered by Quilly
            </p>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-5 gap-3 lg:gap-4 justify-items-center max-w-5xl mx-auto">
            {/* Row 1 - 4 characters with empty space on left */}
            <div></div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/one.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/two.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div></div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/four.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>

            {/* Row 2 - 5 characters (full row) */}
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/five.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div></div>
            <div></div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/eight.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/nine.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>

            {/* Row 3 - 4 characters with empty space on right */}
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/ten.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/eleven.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/twelve.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div></div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/one.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div></div>

            {/* Row 4 - 3 characters with empty spaces on both sides */}
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/two.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/three.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div className="bg-[#F7A83B] rounded-2xl p-2 w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center">
              <Image src="/assets/characters/four.svg" alt="Character" width={128} height={128} className="object-contain w-full h-full" />
            </div>
            <div></div>
          </div>
        </div>

        {/* Section 3 - Footer */}
        <footer className="w-full mt-24 py-12 px-4 lg:px-8 border-t border-[#F7A83B]/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
              {/* Brand Section */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#F7A83B] mb-2 tracking-wide">
                  FEED FLOW
                </h2>
                <p className="text-sm lg:text-base text-[#2C2C2C]/70">
                  The 'Scroll & Read' Revolution is here.
                </p>
              </div>

              {/* Links Section */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                <div className="text-center lg:text-left">
                  <h3 className="font-semibold text-[#2C2C2C] mb-3">Product</h3>
                  <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Stories</a></li>
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Comics</a></li>
                  </ul>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="font-semibold text-[#2C2C2C] mb-3">Company</h3>
                  <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="font-semibold text-[#2C2C2C] mb-3">Legal</h3>
                  <ul className="space-y-2 text-sm text-[#2C2C2C]/70">
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Terms</a></li>
                    <li><a href="#" className="hover:text-[#F7A83B] transition-colors">Cookies</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-[#F7A83B]/20 flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#2C2C2C]/60">
                © {new Date().getFullYear()} Feed Flow. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[#2C2C2C]/60 hover:text-[#F7A83B] transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#2C2C2C]/60 hover:text-[#F7A83B] transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#2C2C2C]/60 hover:text-[#F7A83B] transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
