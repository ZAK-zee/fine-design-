import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { supabase } from '@/supabaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ServicesPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const isAr = language === 'ar';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        setServices(data);
      } else {
        // fallback to translations if DB is empty
        setServices(t.services.items);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${t.services.title} - Fine Design`}</title>
        <meta name="description" content="Explore Fine Design's comprehensive services: Construction, Interior Finishing, Fire Protection, and HVAC." />
      </Helmet>

      <Header />

      <main className="bg-background" dir={isAr ? 'rtl' : 'ltr'}>

        {/* Page Header */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
                {isAr ? 'ما نقدمه' : 'What We Offer'}
              </p>
              <h1 className="text-white mb-6">{t.services.title}</h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                {t.services.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services stacked blocks */}
        <section className="py-8">
          {loading ? (
            <div className="text-center py-32 text-muted-foreground">Loading services...</div>
          ) : (
            services.map((service, index) => (
              <motion.article
                key={service.id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border last:border-b-0"
              >
                {/* Number */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-gold font-bold text-sm tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 h-px bg-gold/30" />
                </div>

                {/* Image */}
                {service.image_url && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <motion.img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Title */}
                <h2 className="text-gold mb-6 text-3xl md:text-4xl font-semibold uppercase tracking-wide">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
                        <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            ))
          )}
        </section>

        {/* CTA */}
        <section className="py-24 bg-secondary">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-foreground">
                {isAr ? 'هل لديك مشروع في ذهنك؟' : 'Have a Project in Mind?'}
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                {isAr ? 'تواصل معنا اليوم ودعنا نحول رؤيتك إلى واقع.' : "Get in touch today and let's turn your vision into reality."}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white font-semibold rounded-xl hover:bg-primary transition-all duration-300 active:scale-95 shadow-lg shadow-gold/20"
              >
                {isAr ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ServicesPage;