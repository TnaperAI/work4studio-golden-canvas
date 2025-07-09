import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ContactFormModal from '@/components/ContactFormModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number;
  price_to: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

const Services = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { getContent } = useSiteContent();
  useScrollAnimation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 Starting to fetch services...');
        
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
          setServices([]);
        } else {
          console.log('✅ Successfully loaded services:', data);
          setServices(data || []);
        }
      } catch (err) {
        console.error('💥 Unexpected error:', err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (from: number, to: number) => {
    return `от ${from.toLocaleString()} ₽`;
  };

  return (
    <div className="min-h-screen">
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
              <div className="flex items-center text-lg text-muted-foreground bg-card border border-border/50 px-6 py-3 rounded-2xl">
                <Target className="h-6 w-6 mr-3 text-primary" />
                Под ключ за 3-14 дней
              </div>
              <div className="flex items-center text-lg text-muted-foreground bg-card border border-border/50 px-6 py-3 rounded-2xl">
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
            {loading && (
              <div className="col-span-full flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="ml-4 text-foreground">Загружаем...</p>
              </div>
            )}
            
            {services && services.length > 0 && services.map((service, index) => (
              <div key={service.id} className="bg-card border border-border p-6 rounded-2xl hover:bg-secondary/80 transition-all">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {service.short_description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    от {service.price_from?.toLocaleString()} ₽
                  </span>
                  <Link to={`/services/${service.slug}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/80">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            
            {!loading && (!services || services.length === 0) && (
              <div className="col-span-full text-center py-16">
                <p className="text-foreground text-xl">Услуги не найдены</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Данные: {JSON.stringify(services?.length || 'нет')}
                </p>
              </div>
            )}
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
            <div className="p-12 md:p-16 bg-card border border-border rounded-3xl">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('services', 'cta_title') || 'Не знаете, какой формат подойдёт?'}
              </h2>
              <p className="text-muted-foreground mb-10 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
                {getContent('services', 'cta_subtitle') || 'Расскажите о своих задачах — поможем выбрать оптимальное решение и запустим проект в кратчайшие сроки'}
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl px-10 py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => setIsContactModalOpen(true)}
              >
                {getContent('services', 'cta_button') || 'Получить консультацию'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
      
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default Services;