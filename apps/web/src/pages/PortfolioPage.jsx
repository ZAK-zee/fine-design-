import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { supabase } from '@/supabaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CATEGORIES = ['All', 'Construction & Building Works', 'Interior Finishing & Fit-Out', 'Fire Fighting & Fire Alarm Systems', 'HVAC Maintenance & Services'];

// ── Skeleton card
const SkeletonCard = ({ tall }) => (
  <div className={`rounded-2xl overflow-hidden bg-gray-100 animate-pulse ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
);

// ── Single Portfolio Card
const PortfolioCard = ({ item, index, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const tall = index % 5 === 0 || index % 5 === 3; // every 1st and 4th in group of 5 is tall

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      onClick={() => onClick(item)}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-100 ${tall ? 'row-span-2' : ''}`}
      style={{ breakInside: 'avoid', marginBottom: '1.5rem' }}
    >
      {/* Skeleton */}
      {!loaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
      )}

      {/* Image */}
      <img
        src={item.image_url}
        alt={item.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2744]/95 via-[#1A2744]/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />

      {/* Hover content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
        <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Tag className="w-3 h-3" />{item.category}
        </span>
        <h3 className="text-white font-semibold text-lg leading-snug mb-3">{item.title}</h3>
        {item.description && (
          <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{item.description}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-[#C9A84C] text-xs font-semibold">
          <ZoomIn className="w-4 h-4" />
          <span>View Details</span>
        </div>
      </div>

      {/* Category badge (always visible) */}
      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-0 transition-opacity">
        {item.category}
      </div>
    </motion.div>
  );
};

// ── Detail Modal
const Modal = ({ item, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [hasPrev, hasNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
          onClick={e => e.stopPropagation()}
        >
          {/* Image side */}
          <div className="relative md:w-3/5 aspect-[4/3] md:aspect-auto flex-shrink-0 bg-gray-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2744]/60 to-transparent" />

            {/* Nav arrows */}
            {hasPrev && (
              <button onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && (
              <button onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content side */}
          <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Close */}
              <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all z-10">
                <X className="w-4 h-4" />
              </button>

              {/* Category */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 px-3 py-1.5 rounded-full mb-4">
                <Tag className="w-3 h-3" />{item.category}
              </span>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A2744] leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {item.title}
              </h2>

              {/* Divider */}
              <div className="w-12 h-0.5 bg-[#C9A84C] mb-6" />

              {/* Description */}
              {item.description && (
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {item.description}
                </p>
              )}

              {/* Details */}
              {item.details && (
                <p className="text-gray-500 leading-relaxed text-sm">
                  {item.details}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Fine Design Contracting</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page
const PortfolioPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isAr = language === 'ar';

  const [activeFilter, setActiveFilter] = useState('All');
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPortfolio(data);
      setLoading(false);
    };
    fetchPortfolio();
  }, []);

  const filtered = activeFilter === 'All'
    ? portfolio
    : portfolio.filter(item => item.category === activeFilter);

  const openModal = (item) => {
    const idx = filtered.findIndex(i => i.id === item.id);
    setSelectedIndex(idx);
  };

  const closeModal = () => setSelectedIndex(null);
  const goPrev = () => setSelectedIndex(i => Math.max(0, i - 1));
  const goNext = () => setSelectedIndex(i => Math.min(filtered.length - 1, i + 1));

  return (
    <>
      <Helmet>
        <title>{`${t.portfolio.title} - Fine Design`}</title>
        <meta name="description" content="Browse Fine Design's portfolio of completed projects." />
      </Helmet>

      <Header />

      <main className="bg-background" dir={isAr ? 'rtl' : 'ltr'}>

        {/* ── Hero header */}
        <section className="pt-32 pb-16 bg-[#1A2744] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A84C] rounded-full blur-3xl" />
          </div>

          {/* Decorative lines */}
          <div className="absolute left-0 top-0 h-full w-px bg-white/5" style={{ left: '10%' }} />
          <div className="absolute left-0 top-0 h-full w-px bg-white/5" style={{ left: '90%' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em] mb-5">
                {isAr ? 'أعمالنا' : 'Our Work'}
              </p>
              <h1 className="text-white text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t.portfolio.title}
              </h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                {t.portfolio.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Filter bar */}
        <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-[#1A2744] text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >
                  {cat}
                  {activeFilter === cat && (
                    <span className="ml-2 text-xs bg-[#C9A84C] text-black px-1.5 py-0.5 rounded-full">
                      {filtered.length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loading ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} style={{ breakInside: 'avoid', marginBottom: '1.5rem' }}>
                    <SkeletonCard tall={i % 5 === 0 || i % 5 === 3} />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ZoomIn className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
                <p className="text-gray-400">No projects in this category. Add some from the admin dashboard.</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="columns-1 md:columns-2 lg:columns-3 gap-6"
                >
                  {filtered.map((item, index) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={openModal}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* ── CTA */}
        <section className="py-24 bg-[#1A2744]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-4">
                {isAr ? 'ابدأ مشروعك' : 'Start Your Project'}
              </p>
              <h2 className="text-white text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {isAr ? 'هل لديك مشروع في ذهنك؟' : 'Have a Project in Mind?'}
              </h2>
              <p className="text-white/50 mb-10 text-lg">
                {isAr ? 'تواصل معنا ودعنا نحول رؤيتك إلى واقع.' : "Get in touch and let's turn your vision into reality."}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#C9A84C] text-black font-bold rounded-2xl hover:bg-white transition-all duration-300 active:scale-95 shadow-lg shadow-[#C9A84C]/20 text-sm uppercase tracking-wide"
              >
                {isAr ? 'تواصل معنا' : 'Contact Us'}
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Modal */}
      {selectedIndex !== null && filtered[selectedIndex] && (
        <Modal
          item={filtered[selectedIndex]}
          onClose={closeModal}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filtered.length - 1}
        />
      )}
    </>
  );
};

export default PortfolioPage;