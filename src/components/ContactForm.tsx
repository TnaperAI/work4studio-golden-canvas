import { useState } from 'react';
import { Send, Mail, MessageCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Заявка отправлена!",
        description: "Мы получили вашу заявку и свяжемся с вами в ближайшее время.",
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке заявки. Попробуйте еще раз.",
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
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Обсудим ваш</span>{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">проект</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Оставьте заявку, и мы свяжемся с вами для обсуждения деталей и создания идеального решения
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <div className="p-8 md:p-10 bg-card border border-border rounded-3xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="name" className="block text-lg font-semibold mb-3">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                      placeholder="Как к вам обращаться?"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-lg font-semibold mb-3">
                      Email
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
                    <label htmlFor="phone" className="block text-lg font-semibold mb-3">
                      Телефон (необязательно)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-lg font-semibold mb-3">
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-lg"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full text-lg px-8 py-4 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        Отправить заявку
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
                    Свяжитесь с нами напрямую
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Предпочитаете личное общение? Выберите удобный способ связи и получите быстрый ответ
                  </p>
                </div>

                <div className="space-y-6">
                  <a
                    href="mailto:hello@work4studio.com"
                    className="flex items-center p-6 bg-card border border-border rounded-2xl group hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold mb-1">Email</h4>
                      <p className="text-muted-foreground text-lg">hello@work4studio.com</p>
                    </div>
                  </a>

                  <a
                    href="https://t.me/work4studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-6 bg-card border border-border rounded-2xl group hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold mb-1">Telegram</h4>
                      <p className="text-muted-foreground text-lg">Написать напрямую</p>
                    </div>
                  </a>

                  <a 
                    href="tel:+79991234567" 
                    className="flex items-center p-6 bg-card border border-border rounded-2xl group hover:shadow-xl transition-all duration-300 hover:scale-105 w-full"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-6 text-left">
                      <h4 className="text-xl font-bold mb-1">Позвонить</h4>
                      <p className="text-muted-foreground text-lg">+7 (999) 123-45-67</p>
                    </div>
                  </a>
                </div>

                <div className="p-8 bg-secondary border border-primary/20 rounded-2xl">
                  <p className="text-lg text-center leading-relaxed">
                    ⚡ <strong className="text-primary">Быстрый ответ:</strong> Отвечаем в течение 30 минут в рабочее время
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