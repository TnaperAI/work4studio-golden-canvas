import { useState } from 'react';
import ContactFormModal from './ContactFormModal';
import { useSiteContent } from '@/hooks/useSiteContent';

const Hero = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { getContent } = useSiteContent();

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-16">
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-on-scroll">
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-glow text-center px-4">
              {getContent('hero', 'title').split('работают за вас')[0]}
              <br className="sm:hidden" />
              <span className="text-primary">работают за вас</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              {getContent('hero', 'subtitle')}
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="pt-4">
            <button 
              className="btn-gold"
              onClick={() => setIsContactModalOpen(true)}
            >
              {getContent('hero', 'cta_button')}
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                {getContent('stats', 'days')}
              </div>
              <div className="text-muted-foreground">{getContent('stats', 'days_text')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                {getContent('stats', 'support')}
              </div>
              <div className="text-muted-foreground">{getContent('stats', 'support_text')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading font-bold text-primary mb-2">
                {getContent('stats', 'code')}
              </div>
              <div className="text-muted-foreground">{getContent('stats', 'code_text')}</div>
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