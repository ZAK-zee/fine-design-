
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200 active:scale-95"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-gold" />
      <span className="text-sm font-medium uppercase tracking-wider">
        {language === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;
