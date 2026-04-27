import React from "react";
import {motion} from "framer-motion";
import {Instagram, Facebook, Video} from "lucide-react";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-400",
    border: "border-pink-500/50",
    bgActive: "bg-pink-500/10",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bgActive: "bg-blue-500/10",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Video,
    color: "text-cyan-400",
    border: "border-cyan-400/50",
    bgActive: "bg-gradient-to-r from-cyan-500/10 to-pink-500/10",
  },
];

export default function PlatformSelector({activePlatform, setActivePlatform}) {
  return (
    <div className="flex gap-3 md:gap-4 justify-start md:justify-end overflow-x-auto flex-nowrap md:flex-wrap pb-2 md:pb-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {platforms.map((p) => {
        const isActive = activePlatform === p.id;
        const Icon = p.icon;
        return (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            className={`relative shrink-0 flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-full transition-all duration-300 border ${isActive ? p.border : "border-white/10"} hover:border-white/20`}
          >
            {isActive && (
              <motion.div
                className={`absolute inset-0 ${p.bgActive} rounded-full`}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.2}}
              />
            )}
            <span
              className={`relative z-10 font-medium ${isActive ? "text-white" : "text-gray-400"}`}
            >
              {p.name}
            </span>
            <Icon
              className={`relative z-10 w-4 h-4 md:w-5 md:h-5 ${p.color} ${!isActive && "opacity-50"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
