import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Clock, DollarSign, Check, Lightbulb, Target, Zap, Globe, Star, Sparkles } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import ContactFormModal from '@/components/ContactFormModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ServiceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number;
  price_to: number;
  features: string[];
  is_active: boolean;
}

const ServiceDetail = () => {
  const { service } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  useScrollAnimation();

  useEffect(() => {
    const fetchService = async () => {
      if (!service) return;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', service)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching service:', error);
      } else {
        setServiceData(data);
      }
      setLoading(false);
    };

    fetchService();
  }, [service]);

  // Fallback данные если не найдены в базе
  const fallbackData = {
    lending: {
      id: 'lending',
      title: 'Лендинг',
      slug: 'lending',
      description: 'Одностраничный сайт, сфокусированный на одной цели: подписка, заявка, покупка. Мы проектируем структуру, пишем тексты, собираем в чистом и современном дизайне.',
      short_description: 'Сайт, который продаёт с первого экрана',
      price_from: 25000,
      price_to: 120000,
      features: ['Прототип и структура', 'Дизайн в фирменном стиле', 'Адаптивная вёрстка', 'SEO-структура', 'Интеграция с CRM', 'CMS для редактирования'],
      is_active: true
    },
    corporate: {
      id: 'corporate',
      title: 'Корпоративный сайт',
      slug: 'corporate',
      description: 'Многостраничный сайт для представления компании, её услуг и команды. Включает разделы о компании, услугах, команде, контактах.',
      short_description: 'Представительство бизнеса онлайн',
      price_from: 45000,
      price_to: 300000,
      features: ['Многостраничная структура', 'Корпоративный дизайн', 'CMS для управления', 'SEO-оптимизация', 'Формы обратной связи', 'Интеграция с соцсетями'],
      is_active: true
    },
    ecommerce: {
      id: 'ecommerce',
      title: 'Интернет-магазин',
      slug: 'ecommerce',
      description: 'Полноценный интернет-магазин с каталогом товаров, корзиной, системой заказов и оплаты. Удобная админка для управления товарами.',
      short_description: 'Каталог + корзина + оплата',
      price_from: 75000,
      price_to: 500000,
      features: ['Каталог товаров с фильтрами', 'Корзина и оформление заказов', 'Интеграция с платёжными системами', 'Система управления заказами', 'CMS для управления товарами', 'Мобильная адаптация'],
      is_active: true
    }
  };

  const currentService = serviceData || fallbackData[service as keyof typeof fallbackData];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Услуга не найдена</h1>
          <Link to="/services">
            <Button>Вернуться к услугам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (from: number, to: number) => {
    return `от ${from.toLocaleString()} ₽`;
  };

  const suitableFor = [
    'Продукта или услуги',
    'Рекламной кампании', 
    'Онлайн-записи',
    'Обратной связи'
  ];

  const faq = [
    {
      question: 'Сколько времени займёт разработка?',
      answer: 'В зависимости от сложности проекта, от 3 до 14 рабочих дней.'
    },
    {
      question: 'Входит ли поддержка в стоимость?',
      answer: 'Да, базовая техническая поддержка входит в стоимость на 3 месяца.'
    },
    {
      question: 'Можно ли вносить изменения?',
      answer: 'Конечно! Мы предусматриваем 2 раунда правок в рамках проекта.'
    }
  ];


  return (
    <div className="min-h-screen">{/* Убираем bg-background чтобы видеть фоновую анимацию */}
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Главная</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/services">Услуги</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentService.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-on-scroll">
            <div className="flex items-center justify-center mb-8">
              <Badge variant="secondary" className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 rounded-2xl">
                <Star className="h-5 w-5 mr-3" />
                {currentService.title}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                {currentService.short_description}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-5xl mx-auto leading-relaxed">
              {currentService.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="p-8 border-0 bg-gradient-to-br from-card/50 to-secondary/30 rounded-3xl backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 text-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-xl">Стоимость</span>
                    <p className="text-muted-foreground text-lg">{formatPrice(currentService.price_from, currentService.price_to)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-12 p-8 md:p-10 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl backdrop-blur-sm border border-primary/20">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary mr-3" />
                <span className="font-bold text-xl">Что входит в услугу</span>
              </div>
              <p className="text-muted-foreground text-lg">
                {currentService.features.join(' • ')}
              </p>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl px-12 py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => setShowContactForm(true)}>
              Заказать {currentService.title.toLowerCase()}
              <ArrowLeft className="ml-3 h-6 w-6 rotate-180" />
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 animate-on-scroll">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Что входит</span>{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">в работу</span>
              </h2>
              <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                Полный цикл разработки от идеи до запуска с гарантией качества
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {currentService.features.map((feature, index) => (
                <div key={index} className="animate-on-scroll group p-8 border-0 bg-gradient-to-br from-card/50 to-secondary/30 rounded-3xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-foreground font-semibold leading-relaxed text-lg">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suitable For */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Подходит</span>{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">для</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {suitableFor.map((item, index) => (
                <div key={index} className="text-center p-8 border-0 bg-gradient-to-br from-card/50 to-secondary/30 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm group">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {index === 0 && <Target className="h-10 w-10 text-primary" />}
                    {index === 1 && <Zap className="h-10 w-10 text-primary" />}
                    {index === 2 && <Globe className="h-10 w-10 text-primary" />}
                    {index === 3 && <Lightbulb className="h-10 w-10 text-primary" />}
                  </div>
                  <p className="font-semibold text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Частые</span>{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">вопросы</span>
            </h2>
            <Accordion type="single" collapsible className="space-y-6">
              {faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-0 bg-gradient-to-r from-card/50 to-secondary/30 rounded-2xl px-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <AccordionTrigger className="text-left font-semibold text-lg py-6 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-on-scroll">
            <div className="p-12 md:p-16 border-0 bg-gradient-to-br from-card/50 to-secondary/30 rounded-3xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Заполните форму и получите {currentService.title.toLowerCase()} быстро
              </h2>
              <p className="text-muted-foreground mb-12 text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                Обсудим ваши задачи, подберём оптимальное решение и запустим проект в кратчайшие сроки
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl px-12 py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => setShowContactForm(true)}>
                Оставить заявку
                <Sparkles className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <ContactFormModal 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
      />
    </div>
  );
};

export default ServiceDetail;