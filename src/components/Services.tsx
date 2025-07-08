import { ArrowRight, Globe, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: 'Разработка сайтов',
      description: 'Создаём лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация.',
      features: ['Адаптивная вёрстка', 'SEO-ready', 'CMS на выбор', 'Интеграции'],
      link: '/services#development'
    },
    {
      icon: Wrench,
      title: 'Поддержка сайтов',
      description: 'Техническая поддержка, доработки и оптимизация существующих проектов. SLA или почасовая оплата.',
      features: ['24/7 мониторинг', 'Быстрые правки', 'Обновления безопасности', 'Консультации'],
      link: '/services#support'
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="mb-6">
            Наши <span className="text-primary">услуги</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Полный цикл работы с вашим веб-проектом — от идеи до постоянной поддержки
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-premium p-8 group cursor-pointer animate-on-scroll"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-heading font-semibold mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={service.link}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Подробнее
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