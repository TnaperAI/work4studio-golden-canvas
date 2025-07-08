import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';

const Services = () => {
  const { getContent } = useSiteContent();

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
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              {getContent('services', 'title') || 'Разрабатываем сайты. Быстро, по делу, под задачи бизнеса.'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {getContent('services', 'subtitle') || 'Выберите подходящий формат — от простого лендинга до интернет-магазина.'}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {service.price}
                    </div>
                  </div>
                  <Link to={service.path}>
                    <Button className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      Подробнее
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Не знаете, какой формат подойдёт?
            </h2>
            <p className="text-muted-foreground mb-8">
              Расскажите о своих задачах — поможем выбрать оптимальное решение
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Получить консультацию
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;