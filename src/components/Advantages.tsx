import { Clock, Code, HeadphonesIcon, Users } from 'lucide-react';

const Advantages = () => {
  const advantages = [
    {
      icon: Clock,
      title: 'Быстрое создание от 3 дней',
      description: 'Современная методология разработки позволяет запускать проекты в кратчайшие сроки без потери качества.'
    },
    {
      icon: Code,
      title: 'Открытый код и доступ к данным',
      description: 'Полный доступ к исходному коду вашего сайта. Никаких ограничений и зависимостей от платформ.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Техническая поддержка команды',
      description: 'Круглосуточная поддержка от нашей команды экспертов. Решаем любые технические вопросы.'
    },
    {
      icon: Users,
      title: 'Прямой контакт без посредников',
      description: 'Работаете напрямую с командой разработчиков. Никаких менеджеров и потери времени на коммуникации.'
    }
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="mb-6">
            Почему выбирают <span className="text-primary">Work4Studio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы объединили современные технологии, AI и человеческую экспертизу 
            для создания идеального процесса разработки
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="card-premium p-6 text-center group animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <advantage.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-lg font-heading font-semibold mb-4">
                {advantage.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-sm">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;