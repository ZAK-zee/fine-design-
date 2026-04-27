import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { supabase } from '@/supabaseClient.js';

const ICON_MAP = {
  Facebook: Facebook,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  YouTube: Youtube,
  Website: Globe,
};

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [socialLinks, setSocialLinks] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [socialRes, settingsRes] = await Promise.all([
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_settings').select('*').limit(1),
      ]);
      if (socialRes.data && socialRes.data.length > 0) setSocialLinks(socialRes.data);
      if (settingsRes.data && settingsRes.data.length > 0) setSiteSettings(settingsRes.data[0]);
    };
    fetchData();
  }, []);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/services', label: t.nav.services },
    { path: '/portfolio', label: t.nav.portfolio },
    { path: '/contact', label: t.nav.contact }
  ];

  const displaySocials = socialLinks.length > 0
    ? socialLinks
    : [
        { platform: 'Facebook', url: '#' },
        { platform: 'Instagram', url: '#' },
        { platform: 'LinkedIn', url: '#' },
      ];

  const phone = siteSettings?.phone || '+971 50 123 4567';
  const email = siteSettings?.email || 'info@finedesign.ae';
  const address = siteSettings?.address || 'Dubai, United Arab Emirates';

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Fine Design Logo" className="h-20 w-auto" />
              <span className="text-xl font-bold text-white">Fine Design</span>
            </div>
            <p className="text-sm text-primary-foreground/80 mb-4">{t.footer.tagline}</p>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gold mb-4 block">
              {language === 'en' ? 'Quick Links' : 'روابط سريعة'}
            </span>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className="block text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gold mb-4 block">
              {language === 'en' ? 'Contact' : 'تواصل معنا'}
            </span>
            <div className="space-y-2">
              <a href={"tel:" + phone} className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />{phone}
              </a>
              <a href={"mailto:" + email} className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />{email}
              </a>
              <a href={siteSettings?.map_link || 'https://maps.app.goo.gl/ckduZQMiUnG6pNUN7'} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />{address}
              </a>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gold mb-4 block">
              {language === 'en' ? 'Follow Us' : 'تابعنا'}
            </span>
            <div className="flex flex-wrap gap-3">
              {displaySocials.map((social) => {
                const IconComponent = ICON_MAP[social.platform] || Globe;
                return (
                  <a key={social.id || social.platform} href={social.url} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center hover:border-gold hover:bg-gold/20 transition-all duration-200"
                    aria-label={social.platform}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/80">{t.footer.copyright}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200">
              {t.footer.links.privacy}
            </Link>
            <Link to="/terms" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200">
              {t.footer.links.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;