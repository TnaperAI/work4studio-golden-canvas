import { ExternalLink, ArrowRight } from 'lucide-react';
import casesImage from '@/assets/cases-preview.jpg';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CasesSection = () => {
  const cases = [
    {
      id: 1,
      title: 'E-commerce платформа',
      description: 'Современный интернет-магазин с интеграцией платежных систем',
      result: '+300% конверсии',
      category: 'E-commerce',
      image: casesImage
    },
    {
      id: 2,
      title: 'Корпоративный сайт',
      description: 'Многоязычный сайт для международной компании',
      result: '+150% лидов',
      category: 'Corporate',
      image: casesImage
    },
    {
      id: 3,
      title: 'SaaS Landing',
      description: 'Конверсионная страница для SaaS продукта',
      result: '+250% регистраций',
      category: 'SaaS',
      image: casesImage
    },
    {
      id: 4,
      title: 'Мобильное приложение',
      description: 'Кроссплатформенное приложение для финтех стартапа',
      result: '+400% пользователей',
      category: 'Mobile',
      image: casesImage
    },
    {
      id: 5,
      title: 'Образовательная платформа',
      description: 'LMS система для онлайн обучения',
      result: '+200% вовлечения',
      category: 'EdTech',
      image: casesImage
    }
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/10"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Наши</span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">кейсы</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Примеры успешных проектов, которые приносят реальные результаты бизнесу
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {cases.map((caseItem, index) => (
                <CarouselItem key={caseItem.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                  <div className="border-0 bg-gradient-to-br from-card/50 to-secondary/30 rounded-2xl group cursor-pointer animate-on-scroll h-full hover:shadow-2xl transition-all duration-500 backdrop-blur-sm hover:scale-105 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={caseItem.image}
                        alt={caseItem.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                          {caseItem.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="text-center text-white">
                          <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">Посмотреть проект</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-xl md:text-2xl font-heading font-bold mb-4">
                        {caseItem.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {caseItem.description}
                      </p>
                      
                      <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {caseItem.result}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-6 bg-gradient-to-r from-card to-secondary border-border hover:shadow-xl" />
            <CarouselNext className="hidden md:flex -right-6 bg-gradient-to-r from-card to-secondary border-border hover:shadow-xl" />
          </Carousel>
          
          <div className="text-center mt-16 animate-on-scroll">
            <button className="bg-transparent text-foreground px-8 py-4 rounded-xl font-medium border border-border text-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/50 transition-all duration-300 inline-flex items-center space-x-3 hover:scale-105">
              <span>Посмотреть все кейсы</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;