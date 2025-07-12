import { Clock, Code, HeadphonesIcon, Users } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const Advantages = () => {
  const { getContent } = useSiteContent();
  const advantages = [
    {
      icon: Clock,
      title: getContent('advantages', '1_title') || 'Быстрое создание от 3 дней',
      description: getContent('advantages', '1_description') || 'Современная методология разработки позволяет запускать проекты в кратчайшие сроки без потери качества.'
    },
    {
      icon: Code,
      title: getContent('advantages', '2_title') || 'Открытый код и доступ к данным',
      description: getContent('advantages', '2_description') || 'Полный доступ к исходному коду вашего сайта. Никаких ограничений и зависимостей от платформ.'
    },
    {
      icon: HeadphonesIcon,
      title: getContent('advantages', '3_title') || 'Техническая поддержка команды',
      description: getContent('advantages', '3_description') || 'Круглосуточная поддержка от нашей команды экспертов. Решаем любые технические вопросы.'
    },
    {
      icon: Users,
      title: getContent('advantages', '4_title') || 'Прямой контакт без посредников',
      description: getContent('advantages', '4_description') || 'Работаете напрямую с командой разработчиков. Никаких менеджеров и потери времени на коммуникации.'
    }
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {getContent('advantages', 'title') || 'Почему выбирают'}
            </span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Work4Studio</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {getContent('advantages', 'subtitle') || 'Мы объединили современные технологии, AI и человеческую экспертизу для создания идеального процесса разработки'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="p-8 text-center group animate-on-scroll bg-card border border-border rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <advantage.icon className="w-10 h-10 text-primary" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-6 leading-tight">
                  {advantage.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;