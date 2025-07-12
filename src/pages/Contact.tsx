import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConsentCheckbox from '@/components/ConsentCheckbox';
interface PageSEO {
  page_title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const {
    toast
  } = useToast();
  useScrollAnimation();
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const {
          data: seoData,
          error
        } = await supabase.from('page_seo').select('*').eq('page_slug', 'contact').maybeSingle();
        if (error) {
          console.error('SEO error:', error);
        } else {
          setPageSEO(seoData);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };
    fetchSEO();
  }, []);

  // Обновляем SEO теги когда загружаются данные
  useEffect(() => {
    if (pageSEO) {
      // Обновляем title
      if (pageSEO.page_title) {
        document.title = pageSEO.page_title;
      }

      // Обновляем meta теги
      const updateMetaTag = (name: string, content: string) => {
        if (!content) return;
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };
      const updatePropertyTag = (property: string, content: string) => {
        if (!content) return;
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      // Обновляем canonical URL
      if (pageSEO.canonical_url) {
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = pageSEO.canonical_url;
      }

      // Устанавливаем мета теги
      updateMetaTag('description', pageSEO.meta_description);
      updateMetaTag('keywords', pageSEO.meta_keywords);
      updatePropertyTag('og:title', pageSEO.og_title);
      updatePropertyTag('og:description', pageSEO.og_description);
      updatePropertyTag('og:image', pageSEO.og_image);
      updatePropertyTag('og:type', 'website');
    }
  }, [pageSEO]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      toast({
        title: "Согласие обязательно",
        description: "Необходимо согласиться с условиями для отправки заявки.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from('contact_submissions').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        source: 'contact_page'
      }]);
      if (error) {
        console.error('Contact form error:', error);
        throw error;
      }
      toast({
        title: 'Заявка отправлена!',
        description: 'Мы свяжемся с вами в ближайшее время.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setIsAgreed(false);
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте еще раз.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen">{/* Убираем bg-background чтобы видеть фоновую анимацию */}
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Главная</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Контакты</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-lg animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-on-scroll">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Обсудим ваш
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                проект
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              Расскажите о своих задачах — поможем найти оптимальное решение и запустим проект в кратчайшие сроки
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center text-lg text-muted-foreground bg-card border border-border px-6 py-3 rounded-2xl">
                <CheckCircle className="h-6 w-6 mr-3 text-primary" />
                Бесплатная консультация
              </div>
              <div className="flex items-center text-lg text-muted-foreground bg-card border border-border px-6 py-3 rounded-2xl">
                <Star className="h-6 w-6 mr-3 text-primary" />
                Ответим в течение часа
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Отправить заявку
                  </span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-medium">Имя</Label>
                    <Input id="name" name="name" type="text" placeholder="Ваше имя" value={formData.name} onChange={handleInputChange} required className="h-14 text-lg bg-background border border-border rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-medium">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required className="h-14 text-lg bg-background border border-border rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-lg font-medium">Сообщение</Label>
                    <Textarea id="message" name="message" placeholder="Расскажите о своем проекте..." value={formData.message} onChange={handleInputChange} required rows={6} className="text-lg bg-background border border-border rounded-2xl" />
                  </div>
                  
                  <ConsentCheckbox isAgreed={isAgreed} onChange={setIsAgreed} />
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    {isSubmitting ? <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Отправляем...
                      </div> : <>
                        <Send className="h-6 w-6 mr-3" />
                        Отправить заявку
                      </>}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 animate-on-scroll">
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-8">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Контактная информация
                  </span>
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Email</h4>
                      <p className="text-muted-foreground">info@work4studio.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Telegram</h4>
                      <p className="text-muted-foreground">@work4studio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Время работы</h4>
                      <p className="text-muted-foreground">Пн-Пт: 10:00 - 19:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-8">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Почему выбирают нас
                  </span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Бесплатная консультация и оценка проекта</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Быстрая разработка от 3 дней</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Гарантия качества и поддержка</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Современные технологии и подходы</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>;
};
export default Contact;