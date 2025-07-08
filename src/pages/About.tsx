import { Zap, Heart, Shield, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const About = () => {
  const principles = [
    {
      icon: Zap,
      title: 'Скорость',
      description: 'Используем современные технологии и AI для ускорения процесса разработки. От идеи до запуска — всего 3 дня.'
    },
    {
      icon: Heart,
      title: 'Честность',
      description: 'Прозрачное ценообразование, реалистичные сроки и открытая коммуникация на всех этапах проекта.'
    },
    {
      icon: Shield,
      title: 'Поддержка',
      description: 'Не бросаем клиентов после запуска. Обеспечиваем техническую поддержку и развитие проектов.'
    },
    {
      icon: Eye,
      title: 'Прозрачность',
      description: 'Полный доступ к коду, документации и аналитике. Вы всегда знаете, что происходит с вашим проектом.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16 animate-on-scroll">
              <h1 className="mb-6">
                О <span className="text-primary">Work4Studio</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Мы — команда разработчиков, которая объединила человеческую экспертизу 
                с возможностями искусственного интеллекта для создания идеального процесса разработки.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-dark-gray">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <h2 className="mb-6">Наша история</h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Work4Studio появилась из желания изменить индустрию веб-разработки. 
                    Мы видели, как клиенты месяцами ждут простые сайты, переплачивают 
                    за базовый функционал и теряются в бюрократии агентств.
                  </p>
                  <p>
                    Наш подход основан на современных технологиях и AI-ассистентах, 
                    которые позволяют нам работать в 10 раз быстрее традиционных команд, 
                    сохраняя высокое качество и индивидуальный подход.
                  </p>
                  <p>
                    Мы не просто пишем код — мы создаём инструменты для роста вашего бизнеса.
                  </p>
                </div>
              </div>

              <div className="animate-on-scroll">
                <div className="card-premium p-8">
                  <h3 className="text-2xl font-heading font-semibold mb-6 text-center">
                    Наши результаты
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-heading font-bold text-primary mb-2">50+</div>
                      <div className="text-sm text-muted-foreground">Проектов запущено</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading font-bold text-primary mb-2">3</div>
                      <div className="text-sm text-muted-foreground">Дня средний срок</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading font-bold text-primary mb-2">98%</div>
                      <div className="text-sm text-muted-foreground">Клиентов довольны</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-heading font-bold text-primary mb-2">24/7</div>
                      <div className="text-sm text-muted-foreground">Поддержка</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="mb-6">Наши принципы</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Четыре основы, на которых строится вся наша работа
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="card-premium p-8 text-center group animate-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <principle.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    {principle.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-dark-gray">
          <div className="container-custom">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="mb-6">Команда экспертов</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Профессионалы с опытом работы в крупных IT-компаниях, 
                объединённые общей целью — создавать лучшие веб-решения
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-premium p-8 text-center animate-on-scroll">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-primary">D</span>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Команда разработки</h3>
                <p className="text-muted-foreground mb-4">Frontend, Backend, DevOps</p>
                <p className="text-sm text-muted-foreground">
                  Опыт в React, Node.js, AWS, и современных AI-инструментах
                </p>
              </div>

              <div className="card-premium p-8 text-center animate-on-scroll">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-primary">U</span>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">UX/UI дизайн</h3>
                <p className="text-muted-foreground mb-4">Дизайн и пользовательский опыт</p>
                <p className="text-sm text-muted-foreground">
                  Создаём интуитивные интерфейсы, которые конвертируют посетителей в клиентов
                </p>
              </div>

              <div className="card-premium p-8 text-center animate-on-scroll">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-primary">M</span>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">Менеджмент</h3>
                <p className="text-muted-foreground mb-4">Управление проектами</p>
                <p className="text-sm text-muted-foreground">
                  Обеспечиваем соблюдение сроков и качества на всех этапах разработки
                </p>
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;