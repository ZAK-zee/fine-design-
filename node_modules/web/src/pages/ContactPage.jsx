import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      toast.success('تم إرسال رسالتك بنجاح! ✅');
      setFormData({ name: '', email: '', phone: '', message: '' });

    } catch (error) {
      toast.error('حدث خطأ، حاول مرة أخرى');
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t.contact.info.address,
      value: t.contact.info.address
    },
    {
      icon: Phone,
      label: t.contact.info.phone,
      value: t.contact.info.phone
    },
    {
      icon: Mail,
      label: t.contact.info.email,
      value: t.contact.info.email
    },
    {
      icon: Clock,
      label: t.contact.info.hours,
      value: t.contact.info.hours
    }
  ];

  return (
    <>
      <Helmet>
        <title>{`${t.contact.title} - Fine Design`}</title>
        <meta
          name="description"
          content="Contact Fine Design for your construction and interior design needs."
        />
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="mb-4">{t.contact.title}</h1>
              <p className="text-xl text-muted-foreground">
                {t.contact.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                  <h2 className="text-2xl font-semibold mb-6">
                    {t.contact.info.title}
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">{info.label}</p>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t.contact.form.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 bg-input text-foreground placeholder:text-muted-foreground"
                      placeholder={t.contact.form.name}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t.contact.form.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2 bg-input text-foreground placeholder:text-muted-foreground"
                      placeholder={t.contact.form.email}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">{t.contact.form.phone}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 bg-input text-foreground placeholder:text-muted-foreground"
                      placeholder={t.contact.form.phone}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{t.contact.form.message}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-2 bg-input text-foreground placeholder:text-muted-foreground resize-none"
                      placeholder={t.contact.form.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
                  >
                    {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;