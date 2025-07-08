import { ArrowDown } from 'lucide-react';
import heroImage from '@/assets/hero-abstract.jpg';

const Hero = () => {
  const scrollToForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-dark-gray to-darker-gray"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-on-scroll">
            <div className="space-y-4">
              <h1 className="text-glow">
                Создаём сайты, которые{' '}
                <span className="text-primary">работают за вас</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Разработка и поддержка сайтов на новой скорости. 
                От идеи до запуска — всего за 3 дня.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToForm}
                className="btn-gold"
              >
                Обсудить проект
              </button>
              <button className="px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg font-medium uppercase tracking-wide">
                Посмотреть кейсы
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">дня до запуска</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">открытый код</div>
              </div>
            </div>
          </div>

          {/* Right Content - Abstract Image */}
          <div className="relative animate-on-scroll">
            <div className="relative">
              <img
                src={heroImage}
                alt="Абстрактная композиция"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-primary" />
      </div>
    </section>
  );
};

export default Hero;