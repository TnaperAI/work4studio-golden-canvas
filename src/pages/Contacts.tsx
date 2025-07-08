import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const Contacts = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16 animate-on-scroll">
              <h1 className="mb-6">
                Свяжитесь с <span className="text-primary">нами</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Готовы обсудить ваш проект? Выберите удобный способ связи или оставьте заявку — 
                мы ответим в течение 30 минут в рабочее время.
              </p>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contacts;