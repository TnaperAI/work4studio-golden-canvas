import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import ContactFormModal from '@/components/ContactFormModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

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

  useEffect(() => {
    const fetchService = async () => {
      if (!service) {
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching service with slug:', service);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', service)
        .eq('is_active', true)
        .maybeSingle();

      console.log('📦 Service data:', data);
      console.log('❌ Service error:', error);

      if (error) {
        console.error('Error fetching service:', error);
        setServiceData(null);
      } else {
        setServiceData(data);
      }
      setLoading(false);
    };

    fetchService();
  }, [service]);

  const formatPrice = (from: number, to: number) => {
    return `от ${from.toLocaleString()} ₽`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Загружаем услугу...</p>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Услуга не найдена</h1>
          <p className="text-gray-400 mb-6">Услуга с адресом "{service}" не существует</p>
          <Link to="/services">
            <Button className="bg-primary hover:bg-primary/80">Вернуться к услугам</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary">Услуги</Link>
            <span>/</span>
            <span className="text-foreground">{serviceData?.title}</span>
          </div>
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
              <div className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-2xl">
                <span className="mr-3">⭐</span>
                {serviceData?.title}
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                {serviceData?.short_description}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-5xl mx-auto leading-relaxed">
              {serviceData?.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-16 max-w-2xl mx-auto">
              <div className="p-8 border-0 bg-gradient-to-br from-card/90 to-secondary/60 rounded-3xl backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-border/30">{/* Увеличил прозрачность */}
                <div className="flex items-center justify-center gap-4 text-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-foreground text-xl block">Стоимость</span>
                    <p className="text-muted-foreground text-lg">{formatPrice(serviceData?.price_from || 0, serviceData?.price_to || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {serviceData?.features && serviceData.features.length > 0 && (
              <div className="mb-12 p-8 md:p-10 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl backdrop-blur-sm border border-primary/20">
                <div className="flex items-center justify-center mb-4">
                  <span className="h-6 w-6 text-primary mr-3">✨</span>
                  <span className="font-bold text-xl">Что входит в услугу</span>
                </div>
                <p className="text-muted-foreground text-lg">
                  {serviceData.features.join(' • ')}
                </p>
              </div>
            )}
            
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl px-12 py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => setShowContactForm(true)}>
              Заказать {serviceData?.title?.toLowerCase()}
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
            {serviceData?.features && serviceData.features.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {serviceData.features.map((feature, index) => (
                  <div key={index} className="animate-on-scroll group p-8 border border-border/30 bg-gradient-to-br from-card/90 to-secondary/60 rounded-3xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <span className="text-2xl">✓</span>
                      </div>
                      <span className="text-foreground font-semibold leading-relaxed text-lg">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <div className="space-y-6">
              <div className="border border-border/30 bg-gradient-to-r from-card/90 to-secondary/60 rounded-2xl px-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300 py-6">
                <h3 className="text-left font-semibold text-lg py-6 text-foreground">
                  Сколько времени займёт разработка?
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed pb-6">
                  В зависимости от сложности проекта, от 3 до 14 рабочих дней.
                </p>
              </div>
              
              <div className="border border-border/30 bg-gradient-to-r from-card/90 to-secondary/60 rounded-2xl px-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300 py-6">
                <h3 className="text-left font-semibold text-lg py-6 text-foreground">
                  Входит ли поддержка в стоимость?
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed pb-6">
                  Да, базовая техническая поддержка входит в стоимость на 3 месяца.
                </p>
              </div>
              
              <div className="border border-border/30 bg-gradient-to-r from-card/90 to-secondary/60 rounded-2xl px-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300 py-6">
                <h3 className="text-left font-semibold text-lg py-6 text-foreground">
                  Можно ли вносить изменения?
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed pb-6">
                  Конечно! Мы предусматриваем 2 раунда правок в рамках проекта.
                </p>
              </div>
            </div>
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
            <div className="p-12 md:p-16 border border-border/30 bg-gradient-to-br from-card/90 to-secondary/60 rounded-3xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Заполните форму и получите {serviceData?.title?.toLowerCase()} быстро
              </h2>
              <p className="text-muted-foreground mb-12 text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                Обсудим ваши задачи, подберём оптимальное решение и запустим проект в кратчайшие сроки
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xl px-12 py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => setShowContactForm(true)}>
                Получить консультацию
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