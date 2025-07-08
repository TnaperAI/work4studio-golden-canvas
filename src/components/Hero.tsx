import { useState } from 'react';
import ContactFormModal from './ContactFormModal';

const Hero = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-on-scroll">
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-glow text-center">
              Создаём сайты, которые{' '}
              <span className="text-primary">работают за вас</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Разработка и поддержка сайтов на новой скорости. 
              От идеи до запуска — всего за 3 дня.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="pt-4">
            <button 
              className="btn-gold"
              onClick={() => setIsContactModalOpen(true)}
            >
              Обсудить проект
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">3</div>
              <div className="text-muted-foreground">дня до запуска</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">поддержка</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">открытый код</div>
            </div>
          </div>
        </div>
      </div>
      
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;