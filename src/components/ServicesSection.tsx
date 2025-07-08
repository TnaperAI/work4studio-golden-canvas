import { Globe, Wrench } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Globe,
      title: 'Разработка сайтов',
      description: 'Лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация.',
      features: ['Адаптивная вёрстка', 'SEO-ready', 'CMS на выбор', 'Интеграции']
    },
    {
      icon: Wrench,
      title: 'Поддержка сайтов',
      description: 'Техническая поддержка, доработки и оптимизация существующих проектов. SLA или почасовая оплата.',
      features: ['24/7 мониторинг', 'Быстрые правки', 'Обновления безопасности', 'Консультации']
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
            Полный цикл работы с вашим веб-проектом
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-premium p-8 group animate-on-scroll"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-heading font-semibold mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;