import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DataTeaserBlock = ({ isLocked, children }) => {
  const navigate = useNavigate();
  if (!isLocked) return children;

  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="backdrop-blur-[4px] blur-[2px] select-none pointer-events-none opacity-60 transition-all duration-300">
        {children}
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigate('/settings?tab=plan');
        }}
        className="flex items-center gap-1 text-[10px] sm:text-xs bg-white hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 px-2 py-1 rounded-full transition-colors whitespace-nowrap border border-zinc-200 dark:border-zinc-700 shadow-sm z-10"
      >
        <Lock size={12} className="text-zinc-500" />
        <span className="font-semibold">הצג</span>
      </button>
    </div>
  );
};

export default DataTeaserBlock;
