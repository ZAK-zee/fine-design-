import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const works = {
  en: [
    {
      category: 'Hotel Works',
      icon: '🏨',
      items: [
        'Complete pool works — Steigenberger Burj Hotel, Hurghada',
        'Wooden works & pergolas — Talaya Hotel, Marsa Alam',
        'Painting & ironwork — Sunrise Hotel, Hurghada',
        'Maintenance & renovation of guest rooms — Steigenberger Aqua Hotel, Hurghada',
        'Spa plant renovation — Steigenberger Aqua & Steigenberger Beach, Hurghada',
        'Exterior & interior painting — Steigenberger Pure Life Hotel, Hurghada',
        'Complete spa plant works — Steigenberger Pure Hotel, Hurghada',
        'Wooden works — Kalaya Hotel, Marsa Alam',
      ]
    },
    {
      category: 'Government Works',
      icon: '🏛️',
      items: [
        'General Traffic Department',
        'General Traffic Department — Giza',
        'Work Permits Department — Giza',
        'Government Hospitals Security Administration',
        'Civil Affairs Sector',
        'Giza Security Sector',
        'Facilities Management — Giza',
      ]
    },
    {
      category: 'Interior Finishing & Furniture',
      icon: '🏗️',
      items: [
        'Mafida (Emaar)',
        'Mountain View (October)',
        'Marassi (North Coast)',
        'Mountain View (New Cairo)',
        'Hyde Park Sinda 1 (North Coast)',
        'Telal (North Coast)',
        'Compound Mafida',
        'Compound Jantay',
        'Compound Beverly Hills',
        'Compound Al Khamayel',
        'Compound Al Canary',
        'Compound Palm Heights',
        'Compound Al Waha',
        'Compound Janna October',
        'Compound Janna Zayed',
        'Compound Dar Misr October',
        'Interior finishing & furniture',
      ]
    }
  ],
  ar: [
    {
      category: 'أعمال الفنادق',
      icon: '🏨',
      items: [
        'أعمال حمامات سباحة متكاملة — فندق شتيجن برج، الغردقة',
        'أعمال خشبية وبرجولات — فندق تالايا، مرسى علم',
        'أعمال دهانات وحدادة — فندق صن رايز، الغردقة',
        'أعمال صيانة وتجديد غرف الإقامة — فندق شتيجن أكوا، الغردقة',
        'أعمال تجديد بلانت سبا — شتيجن أكوا وشتيجن بيتش، الغردقة',
        'أعمال دهانات خارجية وداخلية — فندق شتيجن بيور ليف، الغردقة',
        'أعمال متكاملة بلانت سبا — شتيجن بيور، الغردقة',
        'أعمال خشبية — فندق كالايا، مرسى علم',
      ]
    },
    {
      category: 'الأعمال الحكومية',
      icon: '🏛️',
      items: [
        'الإدارة العامة للمرور',
        'الإدارة العامة لمرور الجيزة',
        'إدارة تصاريح العمل بالجيزة',
        'إدارة تأمين المستشفيات الحكومية',
        'قطاع الأحوال المدنية',
        'قطاع أمن الجيزة',
        'إدارة المنشآت بالجيزة',
      ]
    },
    {
      category: 'أعمال التشطيبات الداخلية',
      icon: '🏗️',
      items: [
        'مفيدا (إعمار)',
        'موتن فيو (أكتوبر)',
        'مراسي (الساحل الشمالي)',
        'موتن فيو (التجمع)',
        'هاي سيندا 1 (الساحل الشمالي)',
        'تلال (الساحل الشمالي)',
        'كمبوند مافيدا',
        'كمبوند جنتى',
        'كمبوند بفري هيلز',
        'كمبوند الخمايل',
        'كمبوند الكناري',
        'كمبوند بالم هايتس',
        'كمبوند الواحة',
        'كمبوند جنة أكتوبر',
        'كمبوند جنة زايد',
        'كمبوند دار مصر أكتوبر',
        'تشطيب داخلي وأثاث',
      ]
    }
  ]
};

const WorksPage = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(null);
  const data = works[language];

  return (
    <>
      <Helmet>
        <title>{language === 'en' ? 'Our Works - Fine Design' : 'مشاريعنا - فاين ديزاين'}</title>
        <meta name="description" content="Fine Design project references across hotels, government, and interior finishing." />
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">
                {language === 'en' ? 'Project References' : 'مراجع المشاريع'}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {language === 'en' ? 'Our Works' : 'مشاريعنا'}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'en'
                  ? 'A selection of projects we have proudly delivered across hotels, government facilities, and residential compounds.'
                  : 'نماذج من مشاريعنا المنجزة في الفنادق والجهات الحكومية والمجمعات السكنية.'}
              </p>
            </motion.div>

            {/* Category filter pills */}
            <div className={`flex flex-wrap gap-3 mb-12 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === null ? 'bg-gold text-black' : 'bg-secondary text-foreground hover:bg-gold/20'}`}>
                {language === 'en' ? 'All' : 'الكل'}
              </button>
              {data.map(section => (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(activeCategory === section.category ? null : section.category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === section.category ? 'bg-gold text-black' : 'bg-secondary text-foreground hover:bg-gold/20'}`}>
                  {section.icon} {section.category}
                </button>
              ))}
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {data.filter(s => activeCategory === null || s.category === activeCategory).map((section, si) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: si * 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Category header */}
                  <div className="bg-primary px-8 py-5 flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-xl font-bold text-white">{section.category}</h2>
                    <span className="ml-auto text-gold text-sm font-semibold">{section.items.length} {language === 'en' ? 'projects' : 'مشروع'}</span>
                  </div>

                  {/* Items list */}
                  <ul className={`divide-y divide-border ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {section.items.map((item, i) => (
                      <li key={i} className={`flex items-center gap-4 px-8 py-4 hover:bg-secondary/50 transition-colors ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Total count */}
            <div className="text-center mt-12 text-muted-foreground text-sm">
              {language === 'en'
                ? `${data.reduce((acc, s) => acc + s.items.length, 0)}+ projects delivered`
                : `أكثر من ${data.reduce((acc, s) => acc + s.items.length, 0)} مشروع منجز`}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default WorksPage;