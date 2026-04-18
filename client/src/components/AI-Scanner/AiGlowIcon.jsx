import React from "react";

const AiGlowIcon = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Siri-like Organic Glow Layers */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main Fluid Blobs */}
        <div className="absolute w-44 h-44 bg-emerald-400/40 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl animate-blob-organic"></div>
        <div className="absolute w-48 h-48 bg-mint-400/30 rounded-[60%_40%_30%_70%/50%_60%_40%_60%] blur-2xl animate-blob-organic [animation-delay:-2s] [animation-duration:12s]"></div>
        <div className="absolute w-40 h-40 bg-teal-400/20 rounded-[30%_70%_60%_40%/60%_30%_50%_70%] blur-xl animate-blob-organic [animation-delay:-4s] [animation-duration:15s]"></div>
      </div>

      {/* Surface Gloss/Reflection (Subtle) */}
      <div className="absolute inset-0 rounded-full border border-white/10 z-20 pointer-events-none"></div>

      {/* Main Container Circle */}
      <div className="relative w-36 h-36 bg-white dark:bg-zinc-800 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.08),inset_0_0_15px_rgba(255,255,255,0.5)] border border-gray-100 dark:border-zinc-700 flex items-center justify-center z-10 overflow-hidden">
        {/* Internal subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 animate-pulse"></div>

        {/* Central Sparkle Icon with Gradient */}
        <div className="relative z-10 flex flex-col items-center">
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" /> {/* Blue-500 */}
                <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan-400 */}
              </linearGradient>
            </defs>
            {/* Classic 3-Sparkles Pattern */}
            <path
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.722L17.25 11.25l-1.009-2.528a2.25 2.25 0 00-1.463-1.463L12.25 6.25l2.528-1.009a2.25 2.25 0 001.463-1.463L17.25 1.25l1.009 2.528a2.25 2.25 0 001.463 1.463L22.25 6.25l-2.528 1.009a2.25 2.25 0 00-1.463 1.463zM18.259 21.222L17.25 23.75l-1.009-2.528a2.25 2.25 0 00-1.463-1.463L12.25 18.75l2.528-1.009a2.25 2.25 0 001.463-1.463L17.25 13.75l1.009 2.528a2.25 2.25 0 001.463 1.463L22.25 18.75l-2.528 1.009a2.25 2.25 0 00-1.463 1.463z"
              fill="url(#sparkle-grad)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AiGlowIcon;
