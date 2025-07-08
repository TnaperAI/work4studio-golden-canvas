import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Clock, DollarSign, Check, Lightbulb, Target, Zap, Globe } from 'lucide-react';
import ContactFormModal from '@/components/ContactFormModal';
import { useState } from 'react';

const ServiceDetail = () => {
  const { service } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);

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
      {/* Breadcrumb */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <Link to="/services" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к услугам
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              {currentService.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {currentService.slogan}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {currentService.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold">Срок:</span> {currentService.duration}
              </div>
              <div className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">Стоимость:</span> {currentService.price}
              </div>
            </div>
            
            <p className="text-muted-foreground mb-8">
              <strong>Входит:</strong> {currentService.included}
            </p>
            
            <Button size="lg" onClick={() => setShowContactForm(true)}>
              Заказать {currentService.name.toLowerCase()}
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              Что входит в работу
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {currentService.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
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
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Заполните форму и получите {currentService.name.toLowerCase()} за {currentService.duration.replace('от ', '')}
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Обсудим ваши задачи и подберём оптимальное решение
            </p>
            <Button size="lg" variant="secondary" onClick={() => setShowContactForm(true)}>
              Оставить заявку
            </Button>
          </div>
        </div>
      </section>

      <ContactFormModal 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
      />
    </div>
  );
};

export default ServiceDetail;