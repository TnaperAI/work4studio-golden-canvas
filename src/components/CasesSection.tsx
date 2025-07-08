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
    <section className="section-padding bg-dark-gray">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="mb-6">
            Наши <span className="text-primary">кейсы</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Примеры успешных проектов, которые приносят реальные результаты
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {cases.map((caseItem, index) => (
                <CarouselItem key={caseItem.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="card-premium group cursor-pointer animate-on-scroll h-full">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={caseItem.image}
                        alt={caseItem.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          {caseItem.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-xl font-heading font-semibold mb-3">
                        {caseItem.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                        {caseItem.description}
                      </p>
                      
                      <div className="text-primary font-semibold">
                        {caseItem.result}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          
          <div className="text-center mt-12 animate-on-scroll">
            <button className="btn-secondary inline-flex items-center space-x-2">
              <span>Посмотреть все кейсы</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;