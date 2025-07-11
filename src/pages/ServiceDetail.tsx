import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', service)
        .eq('is_active', true)
        .maybeSingle();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загружаем услугу...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Услуга не найдена</h1>
          <p className="text-muted-foreground mb-8">Услуга с адресом "{service}" не существует</p>
          <Link to="/services">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к услугам
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary transition-colors">Услуги</Link>
            <span>/</span>
            <span className="text-foreground">{serviceData.title}</span>
          </div>
        </div>
      </section>

      {/* Back Button Section */}
      <section className="py-4 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Назад к услугам</span>
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Badge variant="secondary" className="mb-4">
                {serviceData.title}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                {serviceData.short_description}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {serviceData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Заказать {serviceData.title?.toLowerCase()}
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                >
                  Получить консультацию
                </Button>
              </div>
            </div>
            
            {/* Sidebar with Price */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-card border-border">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      от {serviceData.price_from?.toLocaleString() || 'Цена не указана'}
                    </div>
                    <div className="text-muted-foreground">Стоимость работ</div>
                  </div>
                  
                  <Button 
                    className="w-full mb-4"
                    onClick={() => setShowContactForm(true)}
                  >
                    Обсудить проект
                  </Button>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Бесплатная консультация</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Ответим в течение часа</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Поддержка 3 месяца</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {serviceData.features && serviceData.features.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Что входит в работу
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {serviceData.features.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Частые вопросы
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Сколько времени займёт разработка?
                </h3>
                <p className="text-muted-foreground">
                  В зависимости от сложности проекта, от 3 до 14 рабочих дней.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Входит ли поддержка в стоимость?
                </h3>
                <p className="text-muted-foreground">
                  Да, базовая техническая поддержка входит в стоимость на 3 месяца.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Можно ли вносить изменения?
                </h3>
                <p className="text-muted-foreground">
                  Конечно! Мы предусматриваем 2 раунда правок в рамках проекта.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-foreground">
                  Предоставляете ли гарантию?
                </h3>
                <p className="text-muted-foreground">
                  Да, предоставляем гарантию на все выполненные работы сроком 6 месяцев.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <Card className="bg-card border-border">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Готовы начать проект?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-3xl mx-auto">
                Обсудим ваши задачи, подберём оптимальное решение и запустим проект в кратчайшие сроки
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Получить консультацию
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                >
                  Обсудить бюджет
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <BackToTop />
      
      <ContactFormModal 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
        source="service_detail_page"
      />
    </div>
  );
};

export default ServiceDetail;