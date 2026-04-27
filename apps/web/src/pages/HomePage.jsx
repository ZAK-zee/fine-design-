import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { supabase } from '@/supabaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import TestimonialCard from '@/components/TestimonialCard.jsx';

const HomePage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isAr = language === 'ar';
  const [scrollY, setScrollY] = useState(0);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        setServices(data);
      } else {
        setServices(t.services.items);
      }
      setServicesLoading(false);
    };
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(t.testimonials.items);
      }
    };
    fetchServices();
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollIndicatorOpacity = Math.max(0, 1 - scrollY / 300);

  return (
    <>
      <Helmet>
        <title>Fine Design - Premium Construction & Interior Design</title>
        <meta
          name="description"
          content="Fine Design offers premium construction, interior design, renovation, and fit-out services in Dubai. Transform your space with our expert team."
        />
      </Helmet>

      <Header />

      <main dir={isAr ? 'rtl' : 'ltr'}>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <img
                src="/logo.png"
                alt="Fine Design Logo"
                className="h-56 w-auto mx-auto"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 text-foreground"
            >
              {t.hero.tagline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white font-semibold rounded-xl hover:bg-primary transition-all duration-300 active:scale-95 shadow-lg shadow-gold/20"
              >
                {t.hero.cta}
              </Link>
            </motion.div>
          </div>

          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">{t.hero.scrollIndicator}</span>
            <ChevronDown className="w-6 h-6 text-gold animate-scroll-indicator" />
          </motion.div>
        </section>

        {/* ── Main Services ── */}
        <section className="bg-background py-4">

          {/* Section heading */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-6 mb-2"
            >
              <div className="h-px flex-1 bg-gold/30" />
              <p className="text-gold text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                {isAr ? 'ما نقدمه' : 'What We Offer'}
              </p>
              <div className="h-px flex-1 bg-gold/30" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-foreground mt-4"
            >
              {t.services.title}
            </motion.h2>
          </div>

          {/* Stacked service blocks */}
          {servicesLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading services...</div>
          ) : null}
          {!servicesLoading && services.map((service, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.05 * index }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-border last:border-b-0"
            >
              {/* Index line */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gold font-bold text-sm tracking-widest">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Image */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg shadow-foreground/8">
                <motion.img
                  src={service.image_url || service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                  loading="lazy"
                />
              </div>

              {/* Title */}
              <h3 className="text-gold mb-4 text-2xl md:text-3xl font-semibold uppercase tracking-wide">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2"
                  >
                    <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}

          {/* See all services link */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-4 transition-all duration-300 group"
              >
                {isAr ? 'عرض جميع الخدمات' : 'View All Services'}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="mb-4 text-foreground">{t.testimonials.title}</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id || index}
                  {...testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;