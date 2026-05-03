import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useInView } from 'framer-motion';
import { Shield, Clock, Award, Users, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { supabase } from '@/supabaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

// ── Animated counter
const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(value.replace(/\D/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const timer = setInterval(() => {
      start += Math.ceil(num / 60);
      if (start >= num) { setDisplay(`${num}${suffix}`); clearInterval(timer); }
      else setDisplay(`${start}${suffix}`);
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
};

const VALUE_ICONS = { quality: Award, experience: Star, delivery: Clock, trust: Shield };

const AboutPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isAr = language === 'ar';

  const [aboutContent, setAboutContent] = useState(null);
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [aboutRes, teamRes, statsRes] = await Promise.all([
        supabase.from('about_content').select('*').order('updated_at', { ascending: false }).limit(1),
        supabase.from('team').select('*').order('created_at', { ascending: true }),
        supabase.from('about_stats').select('*').order('sort_order', { ascending: true }),
      ]);
      if (aboutRes.data && aboutRes.data.length > 0) setAboutContent(aboutRes.data[0]);
      if (teamRes.data) setTeam(teamRes.data);
      if (statsRes.data && statsRes.data.length > 0) setStats(statsRes.data);
    };
    fetchData();
  }, []);

  const story = aboutContent?.story || t.about.story;
  const mission = aboutContent?.mission || t.about.mission;
  const aboutImage = aboutContent?.image_url || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80';

  const defaultStats = [
    { label: 'Years of Experience', value: '8+' },
    { label: 'Projects Completed', value: '150+' },
    { label: 'Happy Clients', value: '120+' },
    { label: 'Team Members', value: '35+' },
  ];
  const displayStats = stats.length > 0 ? stats : defaultStats;

  const values = [
    { type: 'quality', ...t.about.values.quality },
    { type: 'experience', ...t.about.values.experience },
    { type: 'delivery', ...t.about.values.delivery },
    { type: 'trust', ...t.about.values.trust },
  ];

  const whyUs = [
    { title: 'End-to-End Delivery', desc: 'From concept to handover, we manage every phase with precision and care.' },
    { title: 'Certified Excellence', desc: 'All works comply with UAE engineering standards and international quality benchmarks.' },
    { title: 'Transparent Process', desc: 'Clear timelines, honest pricing, and regular progress updates throughout your project.' },
    { title: 'Dedicated Team', desc: 'A skilled team of engineers, designers, and project managers committed to your success.' },
    { title: 'Premium Materials', desc: 'We source only the finest materials to ensure durability, aesthetics, and long-term value.' },
    { title: 'Client-First Approach', desc: 'Your vision drives everything. We listen, advise, and execute with your goals at the center.' },
  ];

  return (
    <>
      <Helmet>
        <title>{`${t.about.title} - Fine Design`}</title>
        <meta name="description" content="Learn about Fine Design Contracting — our story, values, and the team behind every project." />
      </Helmet>

      <Header />

      <main className="bg-background" dir={isAr ? 'rtl' : 'ltr'}>

        {/* ── HERO */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="absolute left-[10%] top-0 h-full w-px bg-white/5" />
          <div className="absolute right-[10%] top-0 h-full w-px bg-white/5" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-5">
                {isAr ? 'من نحن' : 'Who We Are'}
              </p>
              <h1 className="text-white mb-6 leading-tight">
                {isAr ? 'نصنع المستقبل، لبنةً لبنة' : 'We Build the Future,'}
                {!isAr && <><br /><span className="text-gold">Stone by Stone.</span></>}
              </h1>
              <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
                {isAr ? 'شركة فاين ديزاين للمقاولات — الجودة والابتكار في كل مشروع' : 'Fine Design Contracting Company — quality and innovation in every project.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR */}
        <section className="bg-gold py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {displayStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <Counter value={stat.value} />
                  </div>
                  <p className="text-primary/70 text-sm font-semibold uppercase tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORY & MISSION */}
        <section className="py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xl shadow-foreground/10">
                  <img src={aboutImage} alt="Fine Design Office" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                </div>
                {/* Gold accent card */}
                <div className="absolute -bottom-6 -right-6 bg-gold rounded-2xl p-6 shadow-xl hidden md:block">
                  <p className="text-primary font-bold text-3xl" style={{ fontFamily: 'Playfair Display, serif' }}>8+</p>
                  <p className="text-primary/70 text-sm font-semibold uppercase tracking-wide">Years of<br/>Excellence</p>
                </div>
                <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-gold/40 rounded-tl-xl" />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-5">
                  {isAr ? 'قصتنا' : 'Our Story'}
                </p>
                <h2 className="text-foreground text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {isAr ? 'بُنيت على الثقة، وصُنعت للبقاء' : 'Built on Trust, Made to Last'}
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-8" />
                <p className="text-foreground text-lg leading-relaxed mb-6">{story}</p>
                <p className="text-muted-foreground leading-relaxed">{mission}</p>
                <Link to="/contact" className="inline-flex items-center gap-2 mt-10 text-gold font-semibold text-sm uppercase tracking-widest group">
                  {isAr ? 'تواصل معنا' : 'Get In Touch'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US */}
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">
                {isAr ? 'لماذا تختارنا' : 'Why Choose Us'}
              </p>
              <h2 className="text-foreground text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                {isAr ? 'الفرق الذي يصنع الفارق' : 'The Difference That Matters'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background border border-border rounded-2xl p-8 hover:border-gold/40 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <h3 className="text-foreground font-bold text-lg mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORE VALUES */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">
                {isAr ? 'قيمنا' : 'Our Values'}
              </p>
              <h2 className="text-foreground text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t.about.valuesTitle}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => {
                const Icon = VALUE_ICONS[value.type] || Shield;
                return (
                  <motion.div
                    key={value.type}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="bg-secondary border border-border rounded-2xl p-8 hover:border-gold/40 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="text-foreground font-bold text-xl mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                    <div className="absolute bottom-0 left-8 right-8 h-px bg-gold/0 group-hover:bg-gold/30 transition-all duration-400" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TEAM */}
        {team.length > 0 && (
          <section className="py-24 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">
                  {isAr ? 'فريقنا' : 'Our Team'}
                </p>
                <h2 className="text-foreground text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {t.about.teamTitle}
                </h2>
              </motion.div>

              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                {team.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className={`flex items-center gap-6 px-8 py-5 hover:bg-secondary/50 transition-colors ${i !== 0 ? 'border-t border-border' : ''}`}
                  >
                    {/* Photo only if exists */}
                    {member.image_url && (
                      <img src={member.image_url} alt={member.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-gold/20" />
                    )}
                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <h3 className="text-foreground font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>{member.name}</h3>
                        <span className="text-gold text-xs font-semibold uppercase tracking-wider">{member.role}</span>
                      </div>
                      {member.bio && <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{member.bio}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-6">
                {isAr ? 'ابدأ اليوم' : "Let's Work Together"}
              </p>
              <h2 className="text-white text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {isAr ? 'رؤيتك تستحق الأفضل' : 'Your Vision Deserves the Best'}
              </h2>
              <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto">
                {isAr ? 'دعنا نحول مشروعك القادم إلى تحفة فنية.' : "Let's turn your next project into a masterpiece."}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-white font-bold rounded-2xl hover:bg-white hover:text-primary transition-all duration-300 active:scale-95 shadow-lg shadow-gold/20 text-sm uppercase tracking-widest"
              >
                {isAr ? 'تواصل معنا' : 'Start a Project'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default AboutPage;