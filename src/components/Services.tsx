import { useState, useEffect } from 'react';
import { ArrowRight, Globe, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import ServiceItem from './ServiceItem';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Переводимые тексты для заголовков
  const { translatedText: servicesTitle } = useTranslatedContent('Наши услуги');
  const { translatedText: servicesSubtitle } = useTranslatedContent('Полный цикл работы с вашим веб-проектом — от идеи до постоянной поддержки');
  const { translatedText: detailsLink } = useTranslatedContent('Подробнее');

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const defaultServices = [
    {
      id: '1',
      title: 'Разработка сайтов',
      slug: 'development',
      short_description: 'Создаём лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация.',
      features: ['Адаптивная вёрстка', 'SEO-ready', 'CMS на выбор', 'Интеграции'],
      is_active: true,
      sort_order: 1
    },
    {
      id: '2',
      title: 'Поддержка сайтов',
      slug: 'support',
      short_description: 'Техническая поддержка, доработки и оптимизация существующих проектов. SLA или почасовая оплата.',
      features: ['24/7 мониторинг', 'Быстрые правки', 'Обновления безопасности', 'Консультации'],
      is_active: true,
      sort_order: 2
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="mb-6" dangerouslySetInnerHTML={{
            __html: servicesTitle.replace('услуги', '<span class="text-primary">услуги</span>').replace('services', '<span class="text-primary">services</span>')
          }} />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayServices.map((service, index) => (
            <ServiceItem key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;