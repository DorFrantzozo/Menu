import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PremiumSidebarButton = () => {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();

  if (!user || user.plan === 'iMenu PRO') return null;

  return (
    <div className="px-4 mt-4 mb-1">
      <button
        onClick={() => navigate('/upgrade')}
        className="
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          border border-amber-300/40 dark:border-amber-500/25
          bg-amber-50/60 dark:bg-amber-900/10
          text-amber-700 dark:text-amber-400
          hover:bg-amber-100/80 dark:hover:bg-amber-900/20
          hover:border-amber-400/60 dark:hover:border-amber-500/40
          transition-all duration-200 group
        "
      >
        <span className="text-base leading-none group-hover:scale-110 transition-transform duration-200">
          👑
        </span>
        <span className="text-sm font-semibold tracking-wide">שדרג מנוי</span>
        <span className="mr-auto text-xs opacity-50 group-hover:opacity-80 transition-opacity">←</span>
      </button>
    </div>
  );
};

export default PremiumSidebarButton;
