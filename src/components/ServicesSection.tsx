import { Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';

const ServicesSection = () => {
  const { getContent } = useSiteContent();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {getContent('services', 'title') || 'Наши'}
            </span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">услуги</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {getContent('services', 'subtitle') || 'Полный цикл работы с вашим веб-проектом от идеи до запуска'}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="animate-on-scroll">
            <div className="bg-card border border-border p-12 md:p-16 rounded-3xl group relative overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-500"></div>
              
              <div className="relative z-10 text-center space-y-10">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-xl">
                  <Globe className="w-12 h-12 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('services', 'main_title') || 'Разработка сайтов'}
                  </h3>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    {getContent('services', 'main_description') || 'Лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
                  {(getContent('services', 'features') || 'Адаптивная вёрстка,SEO-ready,CMS на выбор,Интеграции').split(',').map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs sm:text-sm bg-gradient-to-r from-secondary/80 to-muted/50 rounded-xl px-3 py-2 md:px-4 md:py-3 border border-border/50 hover:border-primary/30 transition-colors group/feature">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-primary to-accent rounded-full mr-2 md:mr-3 flex-shrink-0 group-hover/feature:scale-125 transition-transform"></div>
                      <span className="font-medium text-center flex-1">{feature.trim()}</span>
                    </div>
                  ))}
                </div>

                <Link to="/services" className="bg-transparent text-foreground px-8 py-4 rounded-xl font-medium border border-border text-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/50 transition-all duration-300 inline-flex items-center space-x-3 group/button">
                  <span>{getContent('services', 'button') || 'Подробнее об услуге'}</span>
                  <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;