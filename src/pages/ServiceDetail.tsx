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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Debug Info */}
      <div className="bg-red-500 text-white p-4 text-center">
        <p>DEBUG: Service = {serviceData?.title || 'NULL'}</p>
        <p>Slug = {service}</p>
      </div>
      
      {/* Breadcrumb */}
      <section className="pt-4 pb-4 bg-white/5 border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-white">
            <Link to="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary">Услуги</Link>
            <span>/</span>
            <span className="text-primary">{serviceData?.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Service Title */}
            <div className="mb-8">
              <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⭐ {serviceData?.title}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {serviceData?.short_description}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {serviceData?.description}
            </p>
            
            {/* Price */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 inline-block">
              <div className="flex items-center justify-center gap-3">
                <DollarSign className="h-6 w-6 text-primary" />
                <div>
                  <span className="text-sm text-gray-400 block">Стоимость</span>
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(serviceData?.price_from || 0, serviceData?.price_to || 0)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Features */}
            {serviceData?.features && serviceData.features.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-white text-lg font-semibold mb-4">Что входит в услугу</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {serviceData.features.map((feature, idx) => (
                    <span key={idx} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/80 text-black font-semibold px-8 py-6 text-lg"
              onClick={() => setShowContactForm(true)}
            >
              Заказать {serviceData?.title?.toLowerCase()}
            </Button>
            
          </div>
        </div>
      </section>

      {/* Simple FAQ Section */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Часто задаваемые вопросы</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Сколько времени займёт разработка?</h3>
                <p className="text-gray-300">В зависимости от сложности проекта, от 3 до 14 рабочих дней.</p>
              </div>
              
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Входит ли поддержка в стоимость?</h3>
                <p className="text-gray-300">Да, базовая техническая поддержка входит в стоимость на 3 месяца.</p>
              </div>
              
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Можно ли вносить изменения?</h3>
                <p className="text-gray-300">Конечно! Мы предусматриваем 2 раунда правок в рамках проекта.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Готовы заказать {serviceData?.title?.toLowerCase()}?
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Обсудим ваши задачи и запустим проект в кратчайшие сроки
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/80 text-black font-semibold px-8 py-6 text-lg"
                onClick={() => setShowContactForm(true)}
              >
                Оставить заявку
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