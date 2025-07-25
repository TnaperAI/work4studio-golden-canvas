import { useState } from 'react';
import ContactFormModal from './ContactFormModal';
import { useSiteContent } from '@/hooks/useSiteContent';

const Hero = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { getContent } = useSiteContent();

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-32 overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-10 animate-on-scroll">
          {/* Main heading */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="text-foreground">
                {getContent('hero', 'title') || 'Создаём сайты, которые приносят клиентов'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
              {getContent('hero', 'subtitle')}
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="pt-6">
            <button 
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-10 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setIsContactModalOpen(true)}
            >
              {getContent('hero', 'cta_button')}
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 max-w-4xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                {getContent('stats', 'days')}
              </div>
              <div className="text-muted-foreground font-medium text-lg">{getContent('stats', 'days_text')}</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                {getContent('stats', 'support')}
              </div>
              <div className="text-muted-foreground font-medium text-lg">{getContent('stats', 'support_text')}</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                {getContent('stats', 'code')}
              </div>
              <div className="text-muted-foreground font-medium text-lg">{getContent('stats', 'code_text')}</div>
            </div>
          </div>
        </div>
      </div>
      
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        source="hero_section"
      />
    </section>
  );
};

export default Hero;