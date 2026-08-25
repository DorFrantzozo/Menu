import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const FloatingLanguageSelector = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-2 right-6 z-menu-float flex items-center justify-center w-8 h-8 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-zinc-700 dark:text-zinc-200"
      aria-label="Toggle language"
    >
      <span className="text-sm">
        {language === 'he' ? 'En' : 'עב'}
      </span>
    </button>
  );
};

export default FloatingLanguageSelector;
