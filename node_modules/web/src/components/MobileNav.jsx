import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';

const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/works', label: language === 'en' ? 'Our Works' : 'مشاريعنا' },
    { path: '/portfolio', label: t.nav.portfolio },
    { path: '/contact', label: t.nav.contact },
    { path: '/about', label: t.nav.about },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            <div className="sticky top-0 right-0 p-6 flex justify-end bg-background/95 backdrop-blur z-10 border-b border-border/50">
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-foreground hover:text-gold hover:bg-secondary transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`relative block px-4 py-4 text-lg font-medium transition-all duration-200 rounded-xl ${
                      isActive
                        ? 'text-gold bg-secondary'
                        : 'text-foreground hover:text-gold hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="mobileNavIndicator"
                        className="absolute bottom-3 left-4 w-12 h-[2px] bg-gold rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;