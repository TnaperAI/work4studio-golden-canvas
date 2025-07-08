import { Globe, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  const service = {
    icon: Globe,
    title: 'Разработка сайтов',
    description: 'Лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация.',
    features: ['Адаптивная вёрстка', 'SEO-ready', 'CMS на выбор', 'Интеграции']
  };

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

        <div className="max-w-4xl mx-auto">
          <div className="animate-on-scroll">
            <div className="card-premium p-12 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative z-10 text-center space-y-8">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Globe className="w-10 h-10 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-3xl font-heading font-semibold mb-6">
                    {service.title}
                  </h3>
                  
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                    {service.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm bg-secondary/50 rounded-lg px-4 py-2">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="btn-secondary inline-flex items-center space-x-2 group-hover:border-primary/50 transition-colors">
                  <span>Подробнее об услуге</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;