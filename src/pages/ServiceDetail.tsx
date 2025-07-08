import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
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
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary transition-colors">Услуги</Link>
            <span>/</span>
            <span className="text-foreground">{serviceData.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              {serviceData.title}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {serviceData.short_description}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {serviceData.description}
            </p>
            
            <Card className="mb-8 bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      от {serviceData.price_from?.toLocaleString()} ₽
                    </div>
                    <div className="text-muted-foreground">Стоимость работ</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => setShowContactForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Заказать {serviceData.title?.toLowerCase()}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {serviceData.features && serviceData.features.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                Что входит в работу
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {serviceData.features.map((feature, index) => (
                  <Card key={index} className="bg-card border-border">
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
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Частые вопросы
            </h2>
            
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-foreground">
                    Сколько времени займёт разработка?
                  </h3>
                  <p className="text-muted-foreground">
                    В зависимости от сложности проекта, от 3 до 14 рабочих дней.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-foreground">
                    Входит ли поддержка в стоимость?
                  </h3>
                  <p className="text-muted-foreground">
                    Да, базовая техническая поддержка входит в стоимость на 3 месяца.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-foreground">
                    Можно ли вносить изменения?
                  </h3>
                  <p className="text-muted-foreground">
                    Конечно! Мы предусматриваем 2 раунда правок в рамках проекта.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Готовы начать проект?
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Обсудим ваши задачи, подберём оптимальное решение и запустим проект в кратчайшие сроки
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>
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