import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageEditorProps {
  pageSlug: string;
  onBack: () => void;
}


const PageEditor = ({ pageSlug, onBack }: PageEditorProps) => {
  const { content, getContent, updateContent } = useSiteContent();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Language for editing
  const [selectedLanguage, setSelectedLanguage] = useState<'ru' | 'en'>('ru');

  // Content states for different sections
  const [contentFields, setContentFields] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Load content fields when content is available
    if (content.length > 0) {
      const pageContent: Record<string, string> = {};
      
      if (pageSlug === 'home') {
        // For home page, load hero, stats, services, advantages and cases sections
        content.forEach(c => {
          if (c.language !== selectedLanguage) return;
          if (c.section === 'hero') {
            pageContent[c.key] = c.value;
          } else if (c.section === 'stats') {
            pageContent[`stats_${c.key}`] = c.value;
          } else if (c.section === 'services') {
            pageContent[`services_${c.key}`] = c.value;
          } else if (c.section === 'advantages') {
            pageContent[`advantages_${c.key}`] = c.value;
          } else if (c.section === 'cases') {
            pageContent[`cases_${c.key}`] = c.value;
          }
        });
      } else if (pageSlug === 'contact') {
        content
          .filter(c => c.section === 'contact' && c.language === selectedLanguage)
          .forEach(c => {
            pageContent[c.key] = c.value;
          });
      } else {
        // For other pages, use page slug as section
        content
          .filter(c => c.section === pageSlug && c.language === selectedLanguage)
          .forEach(c => {
            pageContent[c.key] = c.value;
          });
      }

      setContentFields(pageContent);
    }
  }, [content, pageSlug, selectedLanguage]);


  const handleContentSave = async () => {
    try {
      if (pageSlug === 'home') {
        // For home page, save to multiple sections
        await Promise.all([
          // Save hero section fields
          ...Object.entries(contentFields)
            .filter(([key]) => !key.startsWith('stats_') && !key.startsWith('services_') && !key.startsWith('advantages_') && !key.startsWith('cases_'))
            .map(([key, value]) => updateContent('hero', key, value, selectedLanguage)),
          
          // Save stats section fields
          ...Object.entries(contentFields)
            .filter(([key]) => key.startsWith('stats_'))
            .map(([key, value]) => updateContent('stats', key.replace('stats_', ''), value, selectedLanguage)),
            
          // Save services section fields
          ...Object.entries(contentFields)
            .filter(([key]) => key.startsWith('services_'))
            .map(([key, value]) => updateContent('services', key.replace('services_', ''), value, selectedLanguage)),
            
          // Save advantages section fields
          ...Object.entries(contentFields)
            .filter(([key]) => key.startsWith('advantages_') || key.startsWith('advantage_'))
            .map(([key, value]) => updateContent('advantages', key.replace(/^advantages?_/, ''), value, selectedLanguage)),
            
          // Save cases section fields
          ...Object.entries(contentFields)
            .filter(([key]) => key.startsWith('cases_'))
            .map(([key, value]) => updateContent('cases', key.replace('cases_', ''), value, selectedLanguage))
        ]);
      } else if (pageSlug === 'contact') {
        await Promise.all(
          Object.entries(contentFields).map(([key, value]) =>
            updateContent('contact', key, value, selectedLanguage)
          )
        );
      } else {
        // For other pages, use page slug as section
        await Promise.all(
          Object.entries(contentFields).map(([key, value]) =>
            updateContent(pageSlug, key, value, selectedLanguage)
          )
        );
      }

      toast({
        title: 'Успешно',
        description: 'Контент обновлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить контент',
        variant: 'destructive',
      });
    }
  };

  const updateContentField = (key: string, value: string) => {
    setContentFields(prev => ({ ...prev, [key]: value }));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">
              Редактирование страницы: {pageSlug}
            </h1>
            <p className="text-muted-foreground">
              Управление контентом страницы /{pageSlug}
            </p>
          </div>
          <div className="ml-auto w-40">
            <Label>Язык</Label>
            <Select value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as 'ru' | 'en')}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Контент страницы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageSlug === 'home' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="Веб-сайты, которые работают за вас"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок</Label>
                    <Textarea
                      value={contentFields.subtitle || ''}
                      onChange={(e) => updateContentField('subtitle', e.target.value)}
                      placeholder="Описание под заголовком"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Текст кнопки</Label>
                    <Input
                      value={contentFields.cta_button || ''}
                      onChange={(e) => updateContentField('cta_button', e.target.value)}
                      placeholder="Обсудить проект"
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Статистика</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Первая статистика - число</Label>
                        <Input
                          value={contentFields.stats_days || ''}
                          onChange={(e) => updateContentField('stats_days', e.target.value)}
                          placeholder="14"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Первая статистика - текст</Label>
                        <Input
                          value={contentFields.stats_days_text || ''}
                          onChange={(e) => updateContentField('stats_days_text', e.target.value)}
                          placeholder="дней на проект"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Вторая статистика - число</Label>
                        <Input
                          value={contentFields.stats_support || ''}
                          onChange={(e) => updateContentField('stats_support', e.target.value)}
                          placeholder="24/7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Вторая статистика - текст</Label>
                        <Input
                          value={contentFields.stats_support_text || ''}
                          onChange={(e) => updateContentField('stats_support_text', e.target.value)}
                          placeholder="техподдержка"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Третья статистика - число</Label>
                        <Input
                          value={contentFields.stats_code || ''}
                          onChange={(e) => updateContentField('stats_code', e.target.value)}
                          placeholder="100%"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Третья статистика - текст</Label>
                        <Input
                          value={contentFields.stats_code_text || ''}
                          onChange={(e) => updateContentField('stats_code_text', e.target.value)}
                          placeholder="чистый код"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Блок "Наши услуги"</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Заголовок секции</Label>
                        <Input
                          value={contentFields.services_title || ''}
                          onChange={(e) => updateContentField('services_title', e.target.value)}
                          placeholder="Наши услуги"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Подзаголовок секции</Label>
                        <Textarea
                          value={contentFields.services_subtitle || ''}
                          onChange={(e) => updateContentField('services_subtitle', e.target.value)}
                          placeholder="Полный цикл работы с вашим веб-проектом от идеи до запуска"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Название услуги</Label>
                        <Input
                          value={contentFields.services_main_title || ''}
                          onChange={(e) => updateContentField('services_main_title', e.target.value)}
                          placeholder="Разработка сайтов"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Описание услуги</Label>
                        <Textarea
                          value={contentFields.services_main_description || ''}
                          onChange={(e) => updateContentField('services_main_description', e.target.value)}
                          placeholder="Лендинги, многостраничные сайты и MVP. Современный дизайн, быстрая загрузка, SEO-оптимизация."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Особенности (через запятую)</Label>
                        <Input
                          value={contentFields.services_features || ''}
                          onChange={(e) => updateContentField('services_features', e.target.value)}
                          placeholder="Адаптивная вёрстка, SEO-ready, CMS на выбор, Интеграции"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Текст кнопки</Label>
                        <Input
                          value={contentFields.services_button || ''}
                          onChange={(e) => updateContentField('services_button', e.target.value)}
                          placeholder="Подробнее об услуге"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Блок "Преимущества"</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Заголовок секции</Label>
                        <Input
                          value={contentFields.advantages_title || ''}
                          onChange={(e) => updateContentField('advantages_title', e.target.value)}
                          placeholder="Почему выбирают Work4Studio"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Подзаголовок секции</Label>
                        <Textarea
                          value={contentFields.advantages_subtitle || ''}
                          onChange={(e) => updateContentField('advantages_subtitle', e.target.value)}
                          placeholder="Мы объединили современные технологии, AI и человеческую экспертизу для создания идеального процесса разработки"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid gap-4">
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Преимущество 1</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.advantage_1_title || ''}
                              onChange={(e) => updateContentField('advantage_1_title', e.target.value)}
                              placeholder="Быстрое создание от 3 дней"
                            />
                            <Textarea
                              value={contentFields.advantage_1_description || ''}
                              onChange={(e) => updateContentField('advantage_1_description', e.target.value)}
                              placeholder="Современная методология разработки позволяет запускать проекты в кратчайшие сроки без потери качества."
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Преимущество 2</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.advantage_2_title || ''}
                              onChange={(e) => updateContentField('advantage_2_title', e.target.value)}
                              placeholder="Открытый код и доступ к данным"
                            />
                            <Textarea
                              value={contentFields.advantage_2_description || ''}
                              onChange={(e) => updateContentField('advantage_2_description', e.target.value)}
                              placeholder="Полный доступ к исходному коду вашего сайта. Никаких ограничений и зависимостей от платформ."
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Преимущество 3</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.advantage_3_title || ''}
                              onChange={(e) => updateContentField('advantage_3_title', e.target.value)}
                              placeholder="Техническая поддержка команды"
                            />
                            <Textarea
                              value={contentFields.advantage_3_description || ''}
                              onChange={(e) => updateContentField('advantage_3_description', e.target.value)}
                              placeholder="Круглосуточная поддержка от нашей команды экспертов. Решаем любые технические вопросы."
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Преимущество 4</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.advantage_4_title || ''}
                              onChange={(e) => updateContentField('advantage_4_title', e.target.value)}
                              placeholder="Прямой контакт без посредников"
                            />
                            <Textarea
                              value={contentFields.advantage_4_description || ''}
                              onChange={(e) => updateContentField('advantage_4_description', e.target.value)}
                              placeholder="Работаете напрямую с командой разработчиков. Никаких менеджеров и потери времени на коммуникации."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Блок "Наши кейсы"</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Заголовок секции</Label>
                        <Input
                          value={contentFields.cases_title || ''}
                          onChange={(e) => updateContentField('cases_title', e.target.value)}
                          placeholder="Наши кейсы"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Подзаголовок секции</Label>
                        <Textarea
                          value={contentFields.cases_subtitle || ''}
                          onChange={(e) => updateContentField('cases_subtitle', e.target.value)}
                          placeholder="Примеры успешных проектов, которые приносят реальные результаты бизнесу"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Текст кнопки</Label>
                        <Input
                          value={contentFields.cases_button || ''}
                          onChange={(e) => updateContentField('cases_button', e.target.value)}
                          placeholder="Посмотреть все кейсы"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {pageSlug === 'services' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок страницы</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="Разрабатываем сайты. Быстро, по делу, под задачи бизнеса."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок</Label>
                    <Textarea
                      value={contentFields.subtitle || ''}
                      onChange={(e) => updateContentField('subtitle', e.target.value)}
                      placeholder="Выберите подходящий формат — от простого лендинга до интернет-магазина."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Заголовок CTA секции</Label>
                    <Input
                      value={contentFields.cta_title || ''}
                      onChange={(e) => updateContentField('cta_title', e.target.value)}
                      placeholder="Не знаете, какой формат подойдёт?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок CTA секции</Label>
                    <Textarea
                      value={contentFields.cta_subtitle || ''}
                      onChange={(e) => updateContentField('cta_subtitle', e.target.value)}
                      placeholder="Расскажите о своих задачах — поможем выбрать оптимальное решение"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Текст кнопки CTA</Label>
                    <Input
                      value={contentFields.cta_button || ''}
                      onChange={(e) => updateContentField('cta_button', e.target.value)}
                      placeholder="Получить консультацию"
                    />
                  </div>
                </>
              )}

              {pageSlug === 'about' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок страницы</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="О нас"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={contentFields.description || ''}
                      onChange={(e) => updateContentField('description', e.target.value)}
                      placeholder="Описание компании"
                      rows={4}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Наши ценности</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Заголовок секции "Наши ценности"</Label>
                        <Input
                          value={contentFields.values_title || ''}
                          onChange={(e) => updateContentField('values_title', e.target.value)}
                          placeholder="Наши ценности"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Подзаголовок секции "Наши ценности"</Label>
                        <Textarea
                          value={contentFields.values_subtitle || ''}
                          onChange={(e) => updateContentField('values_subtitle', e.target.value)}
                          placeholder="Принципы, которыми мы руководствуемся в работе"
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid gap-4">
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Ценность 1</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.value_1_title || ''}
                              onChange={(e) => updateContentField('value_1_title', e.target.value)}
                              placeholder="Качество"
                            />
                            <Textarea
                              value={contentFields.value_1_description || ''}
                              onChange={(e) => updateContentField('value_1_description', e.target.value)}
                              placeholder="Мы стремимся к совершенству в каждом проекте"
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Ценность 2</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.value_2_title || ''}
                              onChange={(e) => updateContentField('value_2_title', e.target.value)}
                              placeholder="Инновации"
                            />
                            <Textarea
                              value={contentFields.value_2_description || ''}
                              onChange={(e) => updateContentField('value_2_description', e.target.value)}
                              placeholder="Используем современные технологии и подходы"
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Ценность 3</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.value_3_title || ''}
                              onChange={(e) => updateContentField('value_3_title', e.target.value)}
                              placeholder="Честность"
                            />
                            <Textarea
                              value={contentFields.value_3_description || ''}
                              onChange={(e) => updateContentField('value_3_description', e.target.value)}
                              placeholder="Прозрачность в работе и открытое общение"
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Ценность 4</h4>
                          <div className="grid gap-2">
                            <Input
                              value={contentFields.value_4_title || ''}
                              onChange={(e) => updateContentField('value_4_title', e.target.value)}
                              placeholder="Результат"
                            />
                            <Textarea
                              value={contentFields.value_4_description || ''}
                              onChange={(e) => updateContentField('value_4_description', e.target.value)}
                              placeholder="Фокусируемся на достижении целей клиента"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {pageSlug === 'contact' && (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Breadcrumb: Главная</Label>
                      <Input value={contentFields.breadcrumb_home || ''} onChange={(e) => updateContentField('breadcrumb_home', e.target.value)} placeholder="Главная / Home" />
                    </div>
                    <div className="space-y-2">
                      <Label>Breadcrumb: Контакты</Label>
                      <Input value={contentFields.breadcrumb_contact || ''} onChange={(e) => updateContentField('breadcrumb_contact', e.target.value)} placeholder="Контакты / Contacts" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Hero блок</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Заголовок, часть 1</Label>
                        <Input value={contentFields.hero_title_1 || ''} onChange={(e) => updateContentField('hero_title_1', e.target.value)} placeholder="Обсудим ваш / Let's discuss your" />
                      </div>
                      <div className="space-y-2">
                        <Label>Заголовок, часть 2</Label>
                        <Input value={contentFields.hero_title_2 || ''} onChange={(e) => updateContentField('hero_title_2', e.target.value)} placeholder="проект / project" />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Подзаголовок</Label>
                      <Textarea rows={2} value={contentFields.hero_subtitle || ''} onChange={(e) => updateContentField('hero_subtitle', e.target.value)} placeholder="Описание под заголовком" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      <div className="space-y-2">
                        <Label>Преимущество 1</Label>
                        <Input value={contentFields.hero_benefit_1 || ''} onChange={(e) => updateContentField('hero_benefit_1', e.target.value)} placeholder="Бесплатная консультация / Free consultation" />
                      </div>
                      <div className="space-y-2">
                        <Label>Преимущество 2</Label>
                        <Input value={contentFields.hero_benefit_2 || ''} onChange={(e) => updateContentField('hero_benefit_2', e.target.value)} placeholder="Ответим в течение часа / Reply within an hour" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Форма</h3>
                    <div className="space-y-2">
                      <Label>Заголовок формы</Label>
                      <Input value={contentFields.form_title || ''} onChange={(e) => updateContentField('form_title', e.target.value)} placeholder="Отправить заявку / Send request" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                      <div className="space-y-2">
                        <Label>Метка поля Имя</Label>
                        <Input value={contentFields.form_label_name || ''} onChange={(e) => updateContentField('form_label_name', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Плейсхолдер поля Имя</Label>
                        <Input value={contentFields.form_placeholder_name || ''} onChange={(e) => updateContentField('form_placeholder_name', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Метка поля Email</Label>
                        <Input value={contentFields.form_label_email || ''} onChange={(e) => updateContentField('form_label_email', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Плейсхолдер Email</Label>
                        <Input value={contentFields.form_placeholder_email || ''} onChange={(e) => updateContentField('form_placeholder_email', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Метка поля Сообщение</Label>
                        <Input value={contentFields.form_label_message || ''} onChange={(e) => updateContentField('form_label_message', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Плейсхолдер Сообщение</Label>
                        <Input value={contentFields.form_placeholder_message || ''} onChange={(e) => updateContentField('form_placeholder_message', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                      <div className="space-y-2">
                        <Label>Текст «Отправляем...»</Label>
                        <Input value={contentFields.form_sending_text || ''} onChange={(e) => updateContentField('form_sending_text', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Текст кнопки</Label>
                        <Input value={contentFields.form_button_text || ''} onChange={(e) => updateContentField('form_button_text', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                    <div className="space-y-2">
                      <Label>Заголовок блока</Label>
                      <Input value={contentFields.info_title || ''} onChange={(e) => updateContentField('info_title', e.target.value)} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                      <div className="space-y-2">
                        <Label>Метка Email</Label>
                        <Input value={contentFields.info_email_label || ''} onChange={(e) => updateContentField('info_email_label', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={contentFields.info_email || ''} onChange={(e) => updateContentField('info_email', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Метка Telegram</Label>
                        <Input value={contentFields.info_telegram_label || ''} onChange={(e) => updateContentField('info_telegram_label', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Подпись Telegram</Label>
                        <Input value={contentFields.info_telegram_caption || ''} onChange={(e) => updateContentField('info_telegram_caption', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Метка «Время работы»</Label>
                        <Input value={contentFields.info_hours_label || ''} onChange={(e) => updateContentField('info_hours_label', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Время работы</Label>
                        <Input value={contentFields.info_hours_value || ''} onChange={(e) => updateContentField('info_hours_value', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Почему выбирают нас</h3>
                    <div className="space-y-2">
                      <Label>Заголовок секции</Label>
                      <Input value={contentFields.why_title || ''} onChange={(e) => updateContentField('why_title', e.target.value)} />
                    </div>
                    <div className="grid gap-4">
                      <Input value={contentFields.why_point_1 || ''} onChange={(e) => updateContentField('why_point_1', e.target.value)} placeholder="Пункт 1" />
                      <Input value={contentFields.why_point_2 || ''} onChange={(e) => updateContentField('why_point_2', e.target.value)} placeholder="Пункт 2" />
                      <Input value={contentFields.why_point_3 || ''} onChange={(e) => updateContentField('why_point_3', e.target.value)} placeholder="Пункт 3" />
                      <Input value={contentFields.why_point_4 || ''} onChange={(e) => updateContentField('why_point_4', e.target.value)} placeholder="Пункт 4" />
                    </div>
                  </div>
                </>
              )}

              {!['home', 'services', 'about', 'contact'].includes(pageSlug) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Контент для страницы "{pageSlug}" пока не настроен.</p>
                  <p className="text-sm mt-2">Добавьте поля контента в компонент PageEditor.</p>
                </div>
              )}
              
              <Button onClick={handleContentSave}>
                Сохранить контент
              </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default PageEditor;