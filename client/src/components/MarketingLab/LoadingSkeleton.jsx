import React from "react";
import {motion} from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <motion.div
      key="skeleton"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="w-full border border-white/10 bg-[#1e1b24] rounded-xl p-6"
    >
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse shrink-0"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-3 bg-white/5 rounded animate-pulse"></div>
            <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
