import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { translations } from '@/data/translations.js';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/supabaseClient.js';

const ContactPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1);
      if (data && data.length > 0) setSiteSettings(data[0]);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('messages').insert([{ name: formData.name, email: formData.email, phone: formData.phone, message: formData.message }]);
      if (error) throw error;
      toast.success('Message sent successfully! ✅');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong, please try again');
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const defaultEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d863.3226431411073!2d31.2062322!3d30.0572044!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458412368aeddd7%3A0xa2a58ec6011780f8!2s11%20Abou%20Al%20Mahasen%20Al%20Shazli%2C%20Al%20Huwaiteyah%2C%20Agouza%2C%20Giza%20Governorate%203753630!5e0!3m2!1sen!2seg!4v1777332843233!5m2!1sen!2seg';
  const mapEmbedUrl = siteSettings?.map_url || defaultEmbedUrl;

  const contactInfo = [
    {
      icon: MapPin,
      label: language === 'en' ? 'Address' : 'العنوان',
      value: siteSettings?.address || t.contact.info.address
    },
    {
      icon: Phone,
      label: language === 'en' ? 'Phone 1' : 'هاتف 1',
      value: siteSettings?.phone || '+233039871',
      href: `tel:${siteSettings?.phone || '+233039871'}`
    },
    {
      icon: Phone,
      label: language === 'en' ? 'Phone 2' : 'هاتف 2',
      value: siteSettings?.phone2 || '01033020090',
      href: `tel:${siteSettings?.phone2 || '01033020090'}`
    },
    {
      icon: Phone,
      label: language === 'en' ? 'WhatsApp' : 'واتساب',
      value: siteSettings?.whatsapp || '01000056333',
      href: `https://wa.me/${(siteSettings?.whatsapp || '01000056333').replace(/[^0-9]/g, '')}`
    },
    {
      icon: Mail,
      label: language === 'en' ? 'Email' : 'البريد الإلكتروني',
      value: siteSettings?.email || t.contact.info.email,
      href: `mailto:${siteSettings?.email || t.contact.info.email}`
    },
    {
      icon: Clock,
      label: language === 'en' ? 'Working Hours' : 'ساعات العمل',
      value: siteSettings?.hours || t.contact.info.hours
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`${t.contact.title} - Fine Design`}</title>
        <meta name="description" content="Contact Fine Design for your construction and interior design needs." />
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h1 className="mb-4">{t.contact.title}</h1>
              <p className="text-xl text-muted-foreground">{t.contact.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                  <h2 className="text-2xl font-semibold mb-6">{t.contact.info.title}</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">{info.label}</p>
                          {info.href
                            ? <a href={info.href} className="text-muted-foreground hover:text-gold transition-colors">{info.value}</a>
                            : <p className="text-muted-foreground">{info.value}</p>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t.contact.form.name}</Label>
                    <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={t.contact.form.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.contact.form.email}</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={t.contact.form.email} />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.contact.form.phone}</Label>
                    <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="mt-2 bg-input text-foreground placeholder:text-muted-foreground" placeholder={t.contact.form.phone} />
                  </div>
                  <div>
                    <Label htmlFor="message">{t.contact.form.message}</Label>
                    <Textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className="mt-2 bg-input text-foreground placeholder:text-muted-foreground resize-none" placeholder={t.contact.form.message} />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gold text-black hover:bg-gold/90 font-semibold">
                    {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

        {/* Map Section */}
        {mapEmbedUrl && (
          <section className="pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{height: '420px'}}>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{border: 0}}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fine Design Location"
                />
              </div>
              <div className="text-center mt-4">
                <a
                  href={siteSettings?.map_link || 'https://maps.app.goo.gl/ckduZQMiUnG6pNUN7'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gold hover:underline font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </section>
        )}

      <Footer />
    </>
  );
};

export default ContactPage;