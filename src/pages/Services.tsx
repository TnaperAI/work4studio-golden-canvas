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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-18 pb-2 bg-muted/50 border-b">
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/30 rounded-full blur-lg animate-bounce delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary mr-3" />
              <span className="text-primary font-medium">Наши услуги</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 text-glow">
              {getContent('services', 'title') || 'Разрабатываем сайты. Быстро, по делу, под задачи бизнеса.'}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {getContent('services', 'subtitle') || 'Выберите подходящий формат — от простого лендинга до интернет-магазина.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Target className="h-4 w-4 mr-2 text-primary" />
                Под ключ за 3-14 дней
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                С гарантией качества
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Выберите формат для своего бизнеса
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              От быстрого лендинга до полноценного интернет-магазина — найдём решение под ваши задачи
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div key={service.id} className="animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="card-premium group relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-center gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-medium">{service.price}</span>
                      </div>
                    </div>
                    <Link to={service.path}>
                      <Button className="w-full btn-gold group-hover:scale-105 transition-all">
                        Подробнее
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              {getContent('services', 'cta_title') || 'Не знаете, какой формат подойдёт?'}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {getContent('services', 'cta_subtitle') || 'Расскажите о своих задачах — поможем выбрать оптимальное решение'}
            </p>
            <Button size="lg" className="btn-gold text-lg px-8 py-4">
              {getContent('services', 'cta_button') || 'Получить консультацию'}
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Services;