import { useState, useEffect } from 'react';
import { ArrowRight, Globe, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSiteContent } from '@/hooks/useSiteContent';

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
  const { getContent, loading: contentLoading } = useSiteContent();

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
          <h2 className="mb-6">
            {getContent('services', 'title') || 'Наши'} <span className="text-primary">{getContent('services', 'title').includes('Services') ? 'Services' : 'услуги'}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getContent('services', 'subtitle') || 'Полный цикл работы с вашим веб-проектом — от идеи до постоянной поддержки'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayServices.map((service, index) => (
            <div
              key={service.id}
              className="card-premium p-8 group cursor-pointer animate-on-scroll"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-heading font-semibold mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.short_description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-8">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    {getContent('services', 'read_more') || 'Подробнее'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;