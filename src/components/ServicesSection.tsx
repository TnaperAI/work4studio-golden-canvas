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

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Main service card - larger, featured */}
            <div className="mb-8 animate-on-scroll">
              <div className="card-premium p-12 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative z-10 text-center space-y-8">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Globe className="w-10 h-10 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-heading font-semibold mb-6">
                      Разработка сайтов
                    </h3>
                    
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                      Лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
                    {services[0].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm bg-secondary/50 rounded-lg px-4 py-2">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary service - smaller, side card */}
            <div className="ml-auto max-w-md animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="card-premium p-8 group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Wrench className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold mb-3">
                      Поддержка сайтов
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                      Техническая поддержка, доработки и оптимизация существующих проектов.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {services[1].features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;