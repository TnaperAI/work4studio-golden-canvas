import { useSiteContent } from '@/hooks/useSiteContent';

const CTA = () => {
  const { getContent } = useSiteContent();
  const scrollToForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center animate-on-scroll">
          <h2 className="mb-6">
            {getContent('cta', 'title') || 'Хотите'} <span className="text-primary">{getContent('cta', 'title').includes('Ready') ? 'Your Project?' : 'такой же сайт?'}</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {getContent('cta', 'subtitle') || 'Расскажите о своём проекте, и мы создадим индивидуальное решение, которое будет работать именно для вашего бизнеса'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToForm}
              className="btn-gold"
            >
              {getContent('cta', 'button_text') || 'Оставить заявку'}
            </button>
            
            <a
              href="mailto:info@work4studio.com"
              className="px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg font-medium uppercase tracking-wide"
            >
              Написать на Email
            </a>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              ⚡ Ответим в течение 30 минут в рабочее время
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
    </section>
  );
};

export default CTA;