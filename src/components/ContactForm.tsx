import { useState, useEffect } from 'react';
import { Send, Mail, MessageCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';

const ContactForm = () => {
  console.log('🎯 ContactForm component rendered');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { getContent, loading } = useSiteContent();

  console.log('🔍 ContactForm - loading:', loading, 'language:', language);

  // Показываем форму даже если контент загружается
  const formTitle = !loading ? (getContent('contact', 'title') || (language === 'en' ? "Let's discuss your" : 'Обсудим ваш')) : (language === 'en' ? "Let's discuss your" : 'Обсудим ваш');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAgreed) {
      toast({
        title: language === 'en' ? "Consent required" : "Согласие обязательно",
        description: language === 'en' ? "You must agree to the terms to submit the request." : "Необходимо согласиться с условиями для отправки заявки.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        source: 'homepage_form'
      };

      const { error } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (error) {
        throw error;
      }

      // Отправляем уведомление в Telegram
      try {
        await supabase.functions.invoke('notify-telegram', {
          body: submissionData
        });
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError);
        // Не блокируем отправку формы если Telegram недоступен
      }

      toast({
        title: language === 'en' ? "Request sent!" : "Заявка отправлена!",
        description: language === 'en' ? "We received your request and will contact you soon." : "Мы получили вашу заявку и свяжемся с вами в ближайшее время.",
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsAgreed(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: language === 'en' ? "Error" : "Ошибка",
        description: language === 'en' ? "An error occurred while submitting the request. Please try again." : "Произошла ошибка при отправке заявки. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact-form" className="section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('contact', 'title') || (language === 'en' ? "Let's discuss your" : 'Обсудим ваш')}
              </span>{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {language === 'en' ? 'project' : 'проект'}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {getContent('contact', 'subtitle') || (language === 'en' 
                ? 'Submit a request and we will contact you to discuss details and create the perfect solution'
                : 'Оставьте заявку, и мы свяжемся с вами для обсуждения деталей и создания идеального решения'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <div className="p-8 md:p-10 bg-card border border-border rounded-3xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="name" className="block text-lg font-semibold mb-3">
                      {getContent('contact', 'form_name_label') || (language === 'en' ? 'Your name' : 'Ваше имя')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                      placeholder={getContent('contact', 'form_name_placeholder') || (language === 'en' ? 'How should we address you?' : 'Как к вам обращаться?')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-lg font-semibold mb-3">
                      {getContent('contact', 'form_email_label') || 'Email'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-lg font-semibold mb-3">
                      {getContent('contact', 'form_message_label') || (language === 'en' ? 'Message' : 'Сообщение')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-lg"
                      placeholder={getContent('contact', 'form_message_placeholder') || (language === 'en' ? 'Tell us about your project...' : 'Расскажите о вашем проекте...')}
                    />
                  </div>

                  <ConsentCheckbox 
                    isAgreed={isAgreed} 
                    onChange={setIsAgreed}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full text-lg px-8 py-4 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        {getContent('contact', 'form_submit_button') || (language === 'en' ? 'Submit request' : 'Отправить заявку')}
                        <Send className="w-6 h-6 ml-3" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="animate-on-scroll">
              <div className="space-y-10">
                <div>
                  <h3 className="text-3xl md:text-4xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('contact', 'contact_title') || (language === 'en' ? 'Contact us directly' : 'Свяжитесь с нами напрямую')}
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {getContent('contact', 'contact_subtitle') || (language === 'en' 
                      ? 'Prefer personal communication? Choose a convenient way to contact us and get a quick response'
                      : 'Предпочитаете личное общение? Выберите удобный способ связи и получите быстрый ответ'
                    )}
                  </p>
                </div>

                <div className="space-y-6">
                  <a
                    href="mailto:info@work4studio.com"
                    className="flex items-center p-6 bg-card border border-border rounded-2xl group hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold mb-1">Email</h4>
                      <p className="text-muted-foreground text-lg">info@work4studio.com</p>
                    </div>
                  </a>

                  <a
                    href="https://t.me/work4studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-6 bg-card border border-border rounded-2xl group hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold mb-1">Telegram</h4>
                      <p className="text-muted-foreground text-lg">
                        {getContent('contact', 'contact_telegram_text') || (language === 'en' ? 'Write directly' : 'Написать напрямую')}
                      </p>
                    </div>
                  </a>

                  <a 
                    href="tel:+201096453054" 
                    className="flex items-center p-6 bg-card border border-border rounded-2xl group hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-6 text-left">
                      <h4 className="text-xl font-bold mb-1">
                        {getContent('contact', 'contact_phone_text') || (language === 'en' ? 'Call' : 'Позвонить')}
                      </h4>
                      <p className="text-muted-foreground text-lg">+20 109 645 3054</p>
                    </div>
                  </a>
                </div>

                <div className="p-8 bg-secondary border border-primary/20 rounded-2xl">
                  <p className="text-lg text-center leading-relaxed">
                    ⚡ <strong className="text-primary">
                      {language === 'en' ? 'Quick response:' : 'Быстрый ответ:'}
                    </strong> {getContent('contact', 'contact_quick_response_text') || (language === 'en' 
                      ? 'We respond within 30 minutes during business hours'
                      : 'Отвечаем в течение 30 минут в рабочее время'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;