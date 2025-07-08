import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import casesImage from '@/assets/cases-preview.jpg';

const CasesPage = () => {
  const cases = [
    {
      id: 1,
      title: 'E-commerce платформа "TechStore"',
      description: 'Современный интернет-магазин электроники с интеграцией платежных систем и CRM',
      category: 'E-commerce',
      result: '+300% конверсии',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      challenge: 'Клиенту требовался высокопроизводительный магазин с большим каталогом товаров',
      solution: 'Создали оптимизированную платформу с быстрым поиском и удобной админкой',
      image: casesImage,
      link: '#'
    },
    {
      id: 2,
      title: 'Корпоративный сайт "GlobalTech"',
      description: 'Многоязычный сайт для международной IT-компании с модулем карьеры',
      category: 'Corporate',
      result: '+150% лидов',
      technologies: ['Next.js', 'TypeScript', 'Strapi', 'i18n'],
      challenge: 'Необходимо было создать сайт на 5 языках с единой системой управления',
      solution: 'Разработали гибкую CMS с поддержкой многоязычности и SEO-оптимизацией',
      image: casesImage,
      link: '#'
    },
    {
      id: 3,
      title: 'SaaS Landing "AIAssistant"',
      description: 'Конверсионная страница для AI-продукта с интеграцией аналитики',
      category: 'SaaS',
      result: '+250% регистраций',
      technologies: ['React', 'Framer Motion', 'Analytics', 'A/B Tests'],
      challenge: 'Высокая конкуренция в нише AI требовала выделяющегося дизайна',
      solution: 'Создали интерактивную страницу с демо продукта и понятной воронкой',
      image: casesImage,
      link: '#'
    },
    {
      id: 4,
      title: 'Образовательная платформа "LearnFast"',
      description: 'Онлайн-школа с системой видеоуроков и прогресс-трекингом',
      category: 'Education',
      result: '+400% удержания',
      technologies: ['React', 'Video.js', 'Firebase', 'WebRTC'],
      challenge: 'Нужна была стабильная платформа для проведения онлайн-занятий',
      solution: 'Интегрировали видеоплатформу с системой управления курсами',
      image: casesImage,
      link: '#'
    },
    {
      id: 5,
      title: 'Мобильное приложение "FitTracker"',
      description: 'PWA для отслеживания фитнес-активности с синхронизацией данных',
      category: 'Mobile',
      result: '+180% активности',
      technologies: ['React Native', 'Expo', 'SQLite', 'Push'],
      challenge: 'Требовалось нативное приложение с ограниченным бюджетом',
      solution: 'Создали PWA с возможностями нативного приложения',
      image: casesImage,
      link: '#'
    },
    {
      id: 6,
      title: 'Портал недвижимости "PropertyHub"',
      description: 'Агрегатор объектов недвижимости с картами и фильтрацией',
      category: 'Real Estate',
      result: '+220% просмотров',
      technologies: ['Vue.js', 'Laravel', 'Maps API', 'Elasticsearch'],
      challenge: 'Большой объем данных требовал быстрого поиска и фильтрации',
      solution: 'Реализовали умный поиск с геолокацией и продвинутыми фильтрами',
      image: casesImage,
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </Link>
            </div>
            
            <div className="text-center mb-16 animate-on-scroll">
              <h1 className="mb-6">
                Наши <span className="text-primary">кейсы</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Реальные проекты с измеримыми результатами. Каждый кейс — это история успеха наших клиентов.
              </p>
            </div>
          </div>
        </section>

        {/* Cases Grid */}
        <section className="section-padding bg-dark-gray">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases.map((caseItem, index) => (
                <div
                  key={caseItem.id}
                  className="card-premium group cursor-pointer animate-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                    
                    <div className="mb-4">
                      <div className="text-primary font-semibold mb-2">
                        {caseItem.result}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {caseItem.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-secondary text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Задача:</span>
                        <p className="text-muted-foreground">{caseItem.challenge}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium">Решение:</span>
                        <p className="text-muted-foreground">{caseItem.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default CasesPage;