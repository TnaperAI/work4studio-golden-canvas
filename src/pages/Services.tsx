import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, DollarSign, Sparkles, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Services = () => {
  const { getContent } = useSiteContent();
  useScrollAnimation();

  const services = [
    {
      id: 'lending',
      name: 'Лендинг',
      description: 'Одностраничник для рекламы и заявок',
      price: 'от 25 000 ₽',
      duration: 'от 3 дней',
      path: '/services/lending'
    },
    {
      id: 'corporate',
      name: 'Корпоративный сайт',
      description: 'Представительство бизнеса онлайн',
      price: 'от 45 000 ₽',
      duration: 'от 7 дней',
      path: '/services/corporate'
    },
    {
      id: 'ecommerce',
      name: 'Интернет-магазин',
      description: 'Каталог + корзина + оплата',
      price: 'от 75 000 ₽',
      duration: 'от 14 дней',
      path: '/services/ecommerce'
    },
    {
      id: 'mvp',
      name: 'MVP / Startup-сайт',
      description: 'Быстрый запуск проекта с формой лидов',
      price: 'от 35 000 ₽',
      duration: 'от 5 дней',
      path: '/services/mvp'
    },
    {
      id: 'franchise',
      name: 'Сайт под франшизу',
      description: 'Шаблон для клонирования на города',
      price: 'от 55 000 ₽',
      duration: 'от 10 дней',
      path: '/services/franchise'
    },
    {
      id: 'portfolio',
      name: 'Сайт-портфолио',
      description: 'Для экспертов, дизайнеров, агентств',
      price: 'от 30 000 ₽',
      duration: 'от 5 дней',
      path: '/services/portfolio'
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
                <BreadcrumbPage>Услуги</BreadcrumbPage>
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
                {getContent('services', 'title')?.split('Быстро')[0] || 'Разрабатываем сайты.'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                Быстро, по делу, под задачи бизнеса.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              {getContent('services', 'subtitle') || 'Выберите подходящий формат — от простого лендинга до интернет-магазина с полной автоматизацией процессов.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center text-lg text-muted-foreground bg-gradient-to-r from-card/50 to-secondary/30 px-6 py-3 rounded-2xl backdrop-blur-sm border border-border/50">
                <Target className="h-6 w-6 mr-3 text-primary" />
                Под ключ за 3-14 дней
              </div>
              <div className="flex items-center text-lg text-muted-foreground bg-gradient-to-r from-card/50 to-secondary/30 px-6 py-3 rounded-2xl backdrop-blur-sm border border-border/50">
                <Zap className="h-6 w-6 mr-3 text-primary" />
                С гарантией качества
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Выберите формат</span>{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">для своего бизнеса</span>
            </h2>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              От быстрого лендинга до полноценного интернет-магазина — найдём решение под ваши задачи и бюджет
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div key={service.id} className="animate-on-scroll group" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="h-full border-0 bg-gradient-to-br from-card/50 to-secondary/30 p-8 rounded-3xl relative overflow-hidden hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-8 text-lg">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-semibold">{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-semibold">{service.price}</span>
                      </div>
                    </div>
                    
                    <Link to={service.path}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6 group/button">
                        Подробнее
                        <ArrowRight className="ml-3 h-5 w-5 group-hover/button:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-on-scroll">
            <div className="p-12 md:p-16 border-0 bg-gradient-to-br from-card/50 to-secondary/30 rounded-3xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('services', 'cta_title') || 'Не знаете, какой формат подойдёт?'}
              </h2>
              <p className="text-muted-foreground mb-10 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
                {getContent('services', 'cta_subtitle') || 'Расскажите о своих задачах — поможем выбрать оптимальное решение и запустим проект в кратчайшие сроки'}
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl px-10 py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                {getContent('services', 'cta_button') || 'Получить консультацию'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Services;