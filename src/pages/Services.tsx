import { Globe, Wrench, Zap, Shield, Code, Headphones } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const Services = () => {
  const developmentFeatures = [
    { icon: Zap, title: 'Быстрый запуск', description: 'От 3 дней до запуска проекта' },
    { icon: Code, title: 'Современные технологии', description: 'React, Node.js, AI-интеграции' },
    { icon: Shield, title: 'SEO-готовность', description: 'Оптимизация для поисковых систем' },
  ];

  const supportFeatures = [
    { icon: Headphones, title: '24/7 поддержка', description: 'Круглосуточный мониторинг' },
    { icon: Zap, title: 'Быстрые правки', description: 'Исправления в течение 4 часов' },
    { icon: Shield, title: 'Безопасность', description: 'Регулярные обновления защиты' },
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
                Наши <span className="text-primary">услуги</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Полный спектр услуг для создания и поддержки вашего веб-присутствия
              </p>
            </div>
          </div>
        </section>

        {/* Development Section */}
        <section id="development" className="section-padding bg-dark-gray">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="mb-6">Разработка сайтов</h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Создаём современные веб-решения любой сложности: от лендингов до сложных 
                  многофункциональных платформ. Используем передовые технологии и AI для 
                  ускорения процесса разработки.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-2">Что входит:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Дизайн и UX/UI проектирование</li>
                      <li>• Адаптивная вёрстка под все устройства</li>
                      <li>• CMS для самостоятельного редактирования</li>
                      <li>• SEO-оптимизация и быстрая загрузка</li>
                      <li>• Интеграция с внешними сервисами</li>
                      <li>• Тестирование и запуск</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-on-scroll">
                {developmentFeatures.map((feature, index) => (
                  <div key={index} className="card-premium p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-on-scroll lg:order-2">
                {supportFeatures.map((feature, index) => (
                  <div key={index} className="card-premium p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="animate-on-scroll lg:order-1">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Wrench className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="mb-6">Поддержка сайтов</h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Техническая поддержка и развитие ваших проектов. Предлагаем как SLA-контракты 
                  для постоянной поддержки, так и почасовую оплату за отдельные задачи.
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-2">Что делаем:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Техническое обслуживание и мониторинг</li>
                      <li>• Доработки и новый функционал</li>
                      <li>• Обновления безопасности</li>
                      <li>• Оптимизация производительности</li>
                      <li>• Резервное копирование</li>
                      <li>• Консультации по развитию</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm">
                    <strong>Только для наших клиентов:</strong> Поддержка доступна исключительно 
                    для проектов, созданных нашей командой.
                  </p>
                </div>
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

export default Services;