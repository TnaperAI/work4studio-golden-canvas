import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Clock, DollarSign, Check, Lightbulb, Target, Zap, Globe, Star, Sparkles } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import ContactFormModal from '@/components/ContactFormModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useState } from 'react';

const ServiceDetail = () => {
  const { service } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  useScrollAnimation();

  const serviceData = {
    lending: {
      name: 'Лендинг',
      slogan: 'Сайт, который продаёт с первого экрана',
      description: 'Одностраничный сайт, сфокусированный на одной цели: подписка, заявка, покупка. Мы проектируем структуру, пишем тексты, собираем в чистом и современном дизайне. И всё это — за 3–5 дней.',
      duration: 'от 3 рабочих дней',
      price: 'от 25 000 ₽',
      included: 'прототип → дизайн → сборка → настройка → хостинг → домен',
      features: [
        'Прототип и структура',
        'Дизайн в фирменном стиле или нейтральный',
        'Вёрстка (адаптивная, быстрая)',
        'SEO-структура: теги, sitemap',
        'Интеграция с формой, CRM, Telegram (если нужно)',
        'CMS: редактирование текстов, блоков, изображений'
      ],
      suitableFor: [
        'Продукта или услуги',
        'Рекламной кампании',
        'Онлайн-записи',
        'Обратной связи'
      ],
      faq: [
        {
          question: 'А если мне нужно несколько языков?',
          answer: 'Сделаем. Мультиязычность входит в базовый функционал.'
        },
        {
          question: 'А вы пишете тексты?',
          answer: 'Да, входит в стоимость. Наши копирайтеры создадут продающие тексты.'
        },
        {
          question: 'А домен и хостинг?',
          answer: 'Настроим сами. Поможем с выбором и регистрацией домена.'
        }
      ]
    },
    corporate: {
      name: 'Корпоративный сайт',
      slogan: 'Представительство бизнеса онлайн',
      description: 'Многостраничный сайт для представления компании, её услуг и команды. Включает разделы о компании, услугах, команде, контактах. Современный дизайн с возможностью управления контентом.',
      duration: 'от 7 рабочих дней',
      price: 'от 45 000 ₽',
      included: 'прототип → дизайн → разработка → CMS → SEO → хостинг',
      features: [
        'Многостраничная структура',
        'Корпоративный дизайн',
        'CMS для управления контентом',
        'SEO-оптимизация',
        'Формы обратной связи',
        'Интеграция с соцсетями'
      ],
      suitableFor: [
        'Представления компании',
        'Демонстрации услуг',
        'Публикации новостей',
        'Привлечения клиентов'
      ],
      faq: [
        {
          question: 'Можно ли добавлять страницы?',
          answer: 'Да, структура сайта легко расширяется через CMS.'
        },
        {
          question: 'Интегрируете с CRM?',
          answer: 'Да, настроим интеграцию с популярными CRM-системами.'
        },
        {
          question: 'Будет ли сайт быстро загружаться?',
          answer: 'Да, оптимизируем скорость загрузки и производительность.'
        }
      ]
    },
    ecommerce: {
      name: 'Интернет-магазин',
      slogan: 'Каталог + корзина + оплата',
      description: 'Полноценный интернет-магазин с каталогом товаров, корзиной, системой заказов и оплаты. Удобная админка для управления товарами, заказами и клиентами.',
      duration: 'от 14 рабочих дней',
      price: 'от 75 000 ₽',
      included: 'каталог → корзина → оплата → CMS → интеграции → хостинг',
      features: [
        'Каталог товаров с фильтрами',
        'Корзина и оформление заказов',
        'Интеграция с платёжными системами',
        'Система управления заказами',
        'CMS для управления товарами',
        'Мобильная адаптация'
      ],
      suitableFor: [
        'Продажи товаров онлайн',
        'B2B и B2C торговли',
        'Автоматизации продаж',
        'Расширения бизнеса'
      ],
      faq: [
        {
          question: 'Какие платёжные системы поддерживаются?',
          answer: 'ЮKassa, Сбербанк, Тинькофф, PayPal и другие популярные системы.'
        },
        {
          question: 'Можно ли интегрировать с 1С?',
          answer: 'Да, настроим синхронизацию товаров и заказов с 1С.'
        },
        {
          question: 'Сколько товаров можно добавить?',
          answer: 'Без ограничений. Система масштабируется под ваши нужды.'
        }
      ]
    },
    mvp: {
      name: 'MVP / Startup-сайт',
      slogan: 'Быстрый запуск проекта',
      description: 'Минимально жизнеспособный продукт для быстрого тестирования идеи. Содержит ключевой функционал и форму для сбора заявок от потенциальных клиентов.',
      duration: 'от 5 рабочих дней',
      price: 'от 35 000 ₽',
      included: 'концепт → MVP → форма лидов → аналитика → хостинг',
      features: [
        'Минимальный набор функций',
        'Быстрая разработка',
        'Форма сбора лидов',
        'Интеграция с аналитикой',
        'A/B тестирование',
        'Готовность к масштабированию'
      ],
      suitableFor: [
        'Тестирования бизнес-идей',
        'Привлечения инвестиций',
        'Валидации концепции',
        'Быстрого входа на рынок'
      ],
      faq: [
        {
          question: 'Что такое MVP?',
          answer: 'Минимально жизнеспособный продукт с базовым функционалом для тестирования идеи.'
        },
        {
          question: 'Можно ли доработать потом?',
          answer: 'Да, архитектура позволяет легко добавлять новые функции.'
        },
        {
          question: 'Подойдёт ли для стартапа?',
          answer: 'Идеально! MVP позволяет быстро протестировать идею с минимальными затратами.'
        }
      ]
    },
    franchise: {
      name: 'Сайт под франшизу',
      slogan: 'Шаблон для клонирования',
      description: 'Сайт-шаблон для франшизы, который легко адаптируется под разные города и регионы. Единый дизайн с возможностью локальной настройки контента.',
      duration: 'от 10 рабочих дней',
      price: 'от 55 000 ₽',
      included: 'шаблон → мультисайт → CMS → инструкции → поддержка',
      features: [
        'Единый дизайн-шаблон',
        'Мультисайтовая архитектура',
        'Локализация контента',
        'Централизованное управление',
        'Инструкции для франчайзи',
        'Техническая поддержка'
      ],
      suitableFor: [
        'Развития франшизы',
        'Мультирегиональных проектов',
        'Сетевого бизнеса',
        'Масштабирования бренда'
      ],
      faq: [
        {
          question: 'Сколько городов можно подключить?',
          answer: 'Без ограничений. Система масштабируется под любое количество регионов.'
        },
        {
          question: 'Могут ли франчайзи менять контент?',
          answer: 'Да, предусмотрены локальные настройки в рамках бренд-гайдов.'
        },
        {
          question: 'Нужна ли техническая поддержка?',
          answer: 'Да, предоставляем поддержку и обучение для франчайзи.'
        }
      ]
    },
    portfolio: {
      name: 'Сайт-портфолио',
      slogan: 'Для экспертов и дизайнеров',
      description: 'Персональный сайт для демонстрации работ и привлечения клиентов. Элегантный дизайн с акцентом на визуальную подачу проектов и экспертности.',
      duration: 'от 5 рабочих дней',
      price: 'от 30 000 ₽',
      included: 'дизайн → галерея → блог → контакты → SEO → хостинг',
      features: [
        'Галерея работ',
        'Персональный блог',
        'О себе и услугах',
        'Форма для заказов',
        'SEO-оптимизация',
        'Социальные сети'
      ],
      suitableFor: [
        'Дизайнеров и художников',
        'Фотографов',
        'Экспертов и консультантов',
        'Творческих агентств'
      ],
      faq: [
        {
          question: 'Можно ли добавить блог?',
          answer: 'Да, блог входит в базовую комплектацию сайта-портфолио.'
        },
        {
          question: 'Сколько работ можно разместить?',
          answer: 'Без ограничений. Галерея масштабируется под любое количество проектов.'
        },
        {
          question: 'Подойдёт ли для личного бренда?',
          answer: 'Идеально! Сайт-портфолио помогает выстроить экспертность и привлечь клиентов.'
        }
      ]
    }
  };

  const currentService = serviceData[service as keyof typeof serviceData];

  if (!currentService) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Услуга не найдена</h1>
          <Link to="/services">
            <Button>Вернуться к услугам</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-20 pb-3 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Главная</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/services">Услуги</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentService.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-2xl animate-bounce delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-on-scroll">
            <div className="flex items-center justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                <Star className="h-4 w-4 mr-2" />
                {currentService.name}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 text-glow">
              {currentService.slogan}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              {currentService.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="card-premium p-6">
                <div className="flex items-center gap-3 text-lg">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <span className="font-semibold text-foreground">Срок работы</span>
                    <p className="text-muted-foreground">{currentService.duration}</p>
                  </div>
                </div>
              </div>
              <div className="card-premium p-6">
                <div className="flex items-center gap-3 text-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <div>
                    <span className="font-semibold text-foreground">Стоимость</span>
                    <p className="text-muted-foreground">{currentService.price}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 p-6 bg-muted/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <span className="font-semibold">В стоимость входит</span>
              </div>
              <p className="text-muted-foreground">{currentService.included}</p>
            </div>
            
            <Button size="lg" className="btn-gold text-lg px-8 py-4" onClick={() => setShowContactForm(true)}>
              Заказать {currentService.name.toLowerCase()}
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Что входит в работу
              </h2>
              <p className="text-muted-foreground text-lg">
                Полный цикл разработки от идеи до запуска
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentService.features.map((feature, index) => (
                <div key={index} className="animate-on-scroll card-premium p-6 group" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suitable For */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              Подходит для
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {currentService.suitableFor.map((item, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      {index === 0 && <Target className="h-6 w-6 text-primary" />}
                      {index === 1 && <Zap className="h-6 w-6 text-primary" />}
                      {index === 2 && <Globe className="h-6 w-6 text-primary" />}
                      {index === 3 && <Lightbulb className="h-6 w-6 text-primary" />}
                    </div>
                    <p className="font-medium">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              Частые вопросы
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {currentService.faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-2xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Заполните форму и получите {currentService.name.toLowerCase()} за {currentService.duration.replace('от ', '')}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Обсудим ваши задачи и подберём оптимальное решение
            </p>
            <Button size="lg" className="btn-gold text-lg px-8 py-4" onClick={() => setShowContactForm(true)}>
              Оставить заявку
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <ContactFormModal 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
      />
    </div>
  );
};

export default ServiceDetail;