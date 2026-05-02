import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Facebook, Instagram, Linkedin, Twitter, Youtube, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { supabase } from '@/supabaseClient.js';
import LanguageToggle from '@/components/LanguageToggle.jsx';
import MobileNav from '@/components/MobileNav.jsx';

const ICON_MAP = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  YouTube: Youtube,
  Website: Globe,
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSocials = async () => {
      const { data } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
      if (data && data.length > 0) setSocialLinks(data);
    };
    fetchSocials();
  }, []);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/works', label: language === 'en' ? 'Our Works' : 'مشاريعنا' },
    { path: '/portfolio', label: t.nav.portfolio },
    { path: '/contact', label: t.nav.contact },
    { path: '/about', label: t.nav.about },
  ];

  return (
    <>
      <header className={`sticky-nav ${isScrolled ? 'sticky-nav-scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main header row */}
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Fine Design Logo" className="h-16 w-auto group-hover:scale-105 transition-transform duration-200" />
              <span className="text-xl font-bold text-foreground hidden sm:block">Fine Design</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">

              {/* Social icons — desktop only */}
              {socialLinks.length > 0 && (
                <div className="hidden lg:flex items-center gap-2">
                  {socialLinks.map((social) => {
                    const IconComponent = ICON_MAP[social.platform] || Globe;
                    return (
                      <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/60 hover:text-gold hover:bg-gold/10 transition-all duration-200">
                        <IconComponent className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}

              <LanguageToggle />

              {/* Mobile hamburger */}
              <button onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary text-foreground transition-colors duration-200"
                aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile bottom nav bar — all 5 pages + social icons */}
          <div className="lg:hidden border-t border-border/50 pt-3 pb-3 space-y-3">
            <nav className="flex items-center justify-around">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className={`nav-link text-xs px-2 py-1 ${location.pathname === link.path ? 'nav-link-active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social icons row — mobile */}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3 pt-1">
                {socialLinks.map((social) => {
                  const IconComponent = ICON_MAP[social.platform] || Globe;
                  return (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/60 hover:text-gold hover:bg-gold/10 transition-all duration-200">
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
};

export default Header;