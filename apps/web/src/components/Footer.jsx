import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/services', label: t.nav.services },
    { path: '/portfolio', label: t.nav.portfolio },
    { path: '/contact', label: t.nav.contact }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Fine Design Logo"
                className="h-20 w-auto"
              />
              <span className="text-xl font-bold text-white">Fine Design</span>
            </div>
            <p className="text-sm text-primary-foreground/80 mb-4">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gold mb-4 block">
              {t.nav.home}
            </span>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gold mb-4 block">
              {language === 'en' ? 'Connect' : 'تواصل معنا'}
            </span>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center hover:border-gold hover:bg-gold/20 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/80">
            {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200"
            >
              {t.footer.links.privacy}
            </Link>
            <Link
              to="/terms"
              className="text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200"
            >
              {t.footer.links.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;