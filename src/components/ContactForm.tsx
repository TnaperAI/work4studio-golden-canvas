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
    <section id="contact-form" className="section-padding bg-darker-gray">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="mb-6">
              Обсудим ваш <span className="text-primary">проект</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Оставьте заявку, и мы свяжемся с вами для обсуждения деталей
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Как к вам обращаться?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Телефон (необязательно)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Расскажите о вашем проекте..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      Отправить заявку
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="animate-on-scroll">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-heading font-semibold mb-6">
                    Свяжитесь с нами напрямую
                  </h3>
                  <p className="text-muted-foreground">
                    Предпочитаете личное общение? Выберите удобный способ связи
                  </p>
                </div>

                <div className="space-y-6">
                  <a
                    href="mailto:hello@work4studio.com"
                    className="flex items-center p-4 card-premium group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground">hello@work4studio.com</p>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center p-4 card-premium group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Telegram</h4>
                      <p className="text-muted-foreground">Написать напрямую</p>
                    </div>
                  </a>

                  <button className="flex items-center p-4 card-premium group w-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4 text-left">
                      <h4 className="font-semibold">Созвониться</h4>
                      <p className="text-muted-foreground">Назначить звонок</p>
                    </div>
                  </button>
                </div>

                <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm text-center">
                    ⚡ <strong>Быстрый ответ:</strong> Отвечаем в течение 30 минут в рабочее время
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