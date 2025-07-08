import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import casesImage from '@/assets/cases-preview.jpg';

const Cases = () => {
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
            Примеры успешных проектов, которые приносят реальные результаты нашим клиентам
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cases.map((caseItem, index) => (
            <div
              key={caseItem.id}
              className="card-premium group cursor-pointer animate-on-scroll"
              style={{ animationDelay: `${index * 150}ms` }}
            >
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
              
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {caseItem.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {caseItem.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    {caseItem.result}
                  </span>
                  
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-on-scroll">
          <Link
            to="/cases"
            className="btn-gold inline-flex items-center"
          >
            Посмотреть все кейсы
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cases;