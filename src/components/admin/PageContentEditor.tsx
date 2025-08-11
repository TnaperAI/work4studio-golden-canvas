import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSiteContent } from '@/hooks/useSiteContent';

interface PageContentEditorProps {
  slug: string;
  language: 'ru' | 'en';
  onContentChange: (hasContent: boolean) => void;
  onTitleChange: (title: string) => void;
}

const PageContentEditor = ({ slug, language, onContentChange, onTitleChange }: PageContentEditorProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { content, updateContent } = useSiteContent();

  // Define comprehensive content structure for each page based on existing DB data
  const getPageFields = (pageSlug: string) => {
    const fieldStructures = {
      'home': {
        // Hero section
        'hero.title': 'Заголовок героя',
        'hero.subtitle': 'Подзаголовок героя', 
        'hero.cta_button': 'Текст кнопки',
        'hero.stats_projects': 'Статистика - проекты (число)',
        'hero.stats_projects_label': 'Статистика - проекты (текст)',
        'hero.stats_clients': 'Статистика - клиенты (число)',
        'hero.stats_clients_label': 'Статистика - клиенты (текст)',
        'hero.stats_experience': 'Статистика - опыт (число)',
        'hero.stats_experience_label': 'Статистика - опыт (текст)',
        'hero.advantage_1_title': 'Преимущество 1 - заголовок',
        'hero.advantage_1_description': 'Преимущество 1 - описание',
        'hero.advantage_2_title': 'Преимущество 2 - заголовок',
        'hero.advantage_2_description': 'Преимущество 2 - описание',
        'hero.advantage_3_title': 'Преимущество 3 - заголовок',
        'hero.advantage_3_description': 'Преимущество 3 - описание',
        'hero.advantage_4_title': 'Преимущество 4 - заголовок',
        'hero.advantage_4_description': 'Преимущество 4 - описание',
        
        // CTA section
        'cta.title': 'CTA заголовок',
        'cta.subtitle': 'CTA описание',
        'cta.button': 'CTA кнопка',
        'cta.email_button': 'CTA кнопка Email',
        
        // Stats section  
        'stats.days': 'Количество дней',
        'stats.days_text': 'Описание для дней',
        'stats.projects': 'Количество проектов',
        'stats.projects_text': 'Описание проектов',
        'stats.satisfaction': 'Процент довольных клиентов',
        'stats.satisfaction_text': 'Описание удовлетворенности',
        'stats.support': 'Поддержка',
        'stats.support_text': 'Описание поддержки',
        'stats.code': 'Код (%)',
        'stats.code_text': 'Описание кода',
        
        // Services section
        'services.title': 'Заголовок услуг',
        'services.subtitle': 'Описание услуг',
        'services.main_title': 'Основной заголовок услуги',
        'services.main_description': 'Описание услуги',
        'services.features': 'Особенности (через запятую)',
        'services.button': 'Текст кнопки услуг',
        'services.grid_title': 'Заголовок сетки услуг',
        'services.grid_subtitle': 'Описание сетки услуг',
        'services.badge_1_text': 'Бейдж 1',
        'services.badge_2_text': 'Бейдж 2',
        'services.cta_title': 'Services CTA заголовок',
        'services.cta_subtitle': 'Services CTA описание',
        'services.cta_button': 'Services CTA кнопка',
        
        // Advantages section
        'advantages.title': 'Заголовок преимуществ',
        'advantages.subtitle': 'Описание преимуществ',
        'advantages.1_title': 'Преимущество 1 - заголовок',
        'advantages.1_description': 'Преимущество 1 - описание',
        'advantages.2_title': 'Преимущество 2 - заголовок',
        'advantages.2_description': 'Преимущество 2 - описание',
        'advantages.3_title': 'Преимущество 3 - заголовок',
        'advantages.3_description': 'Преимущество 3 - описание',
        'advantages.4_title': 'Преимущество 4 - заголовок',
        'advantages.4_description': 'Преимущество 4 - описание',
        
        // Cases section
        'cases.title': 'Заголовок кейсов',
        'cases.subtitle': 'Описание кейсов',
        'cases.button': 'Текст кнопки кейсов',
        
        // Header navigation
        'header.nav_home': 'Главная',
        'header.nav_services': 'Услуги',
        'header.nav_cases': 'Кейсы',
        'header.nav_about': 'О нас',
        'header.nav_contact': 'Контакты',
        'header.cta_button': 'CTA кнопка в шапке'
      },
      
      'about': {
        'title': 'Заголовок страницы',
        'subtitle': 'Подзаголовок страницы',
        'description': 'Описание компании',
        'breadcrumb_home': 'Хлебная крошка - Главная',
        'breadcrumb_about': 'Хлебная крошка - О нас',
        'hero_title_1': 'Заголовок героя - часть 1',
        'hero_title_2': 'Заголовок героя - часть 2',
        'mission_title': 'Заголовок миссии',
        'vision_title': 'Заголовок видения',
        'values_title': 'Заголовок ценностей',
        'values_subtitle': 'Описание ценностей',
        'value_1_title': 'Ценность 1 - заголовок',
        'value_1_description': 'Ценность 1 - описание',
        'value_2_title': 'Ценность 2 - заголовок', 
        'value_2_description': 'Ценность 2 - описание',
        'value_3_title': 'Ценность 3 - заголовок',
        'value_3_description': 'Ценность 3 - описание',
        'value_4_title': 'Ценность 4 - заголовок',
        'value_4_description': 'Ценность 4 - описание',
        'team_title': 'Заголовок команды',
        'team_title_first': 'Заголовок команды - часть 1',
        'team_title_second': 'Заголовок команды - часть 2',
        'team_subtitle': 'Описание команды',
        'stats_founding_year_label': 'Год основания - подпись',
        'stats_team_label': 'Размер команды - подпись',
        'stats_projects_label': 'Проекты - подпись',
        'stats_clients_label': 'Клиенты - подпись',
        'cta_title_first': 'CTA заголовок - часть 1',
        'cta_title_second': 'CTA заголовок - часть 2',
        'cta_subtitle': 'CTA описание',
        'cta_button_text': 'CTA кнопка'
      },
      
      'contact': {
        'title': 'Заголовок страницы',
        'description': 'Описание контактов',
        'breadcrumb_home': 'Хлебная крошка - Главная',
        'breadcrumb_contact': 'Хлебная крошка - Контакты',
        'address': 'Адрес',
        'address_title': 'Заголовок адреса',
        'email': 'Email',
        'email_title': 'Заголовок email',
        'phone': 'Телефон',
        'phone_title': 'Заголовок телефона',
        'form_title': 'Заголовок формы',
        'form_name_placeholder': 'Плейсхолдер имени',
        'form_email_placeholder': 'Плейсхолдер email',
        'form_phone_placeholder': 'Плейсхолдер телефона',
        'form_message_placeholder': 'Плейсхолдер сообщения',
        'form_submit_button': 'Кнопка отправки',
        'form_consent_text': 'Текст согласия',
        'working_hours': 'Рабочие часы',
        'working_hours_title': 'Заголовок рабочих часов'
      },
      
      'services-page': {
        'title': 'Заголовок страницы',
        'description': 'Описание услуг',
        'breadcrumb_home': 'Хлебная крошка - Главная',
        'breadcrumb_services': 'Хлебная крошка - Услуги',
        'main_title': 'Основной заголовок',
        'main_subtitle': 'Основной подзаголовок',
        'cta_title': 'Заголовок CTA',
        'cta_description': 'Описание CTA',
        'cta_button': 'CTA кнопка',
        'grid_title': 'Заголовок сетки',
        'grid_subtitle': 'Описание сетки'
      }
    };

    return fieldStructures[pageSlug as keyof typeof fieldStructures] || {};
  };

  useEffect(() => {
    const fetchPageContent = async () => {
      setIsLoading(true);
      
      try {
        const fields = getPageFields(slug);
        const data: Record<string, string> = {};
        
        // Fetch content for each field
        for (const [key, label] of Object.entries(fields)) {
          // Split the key to get section and field (e.g., "hero.title" -> section="hero", field="title")
          const [section, field] = key.includes('.') ? key.split('.') : [slug, key];
          
          const value = content.find(item => 
            item.section === section && 
            item.key === field && 
            item.language === language
          )?.value || '';
          data[key] = value;
        }
        
        setFormData(data);
        
        // Check if page has content
        const hasContent = Object.values(data).some(value => value.trim() !== '');
        onContentChange(hasContent);
        
        // Set title for the editor
        const title = data.title || Object.values(data)[0] || `${slug} (${language})`;
        onTitleChange(title);
        
      } catch (error) {
        console.error('Error fetching page content:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить контент страницы",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, [slug, language, content]);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save each field
      for (const [key, value] of Object.entries(formData)) {
        // Split the key to get section and field (e.g., "hero.title" -> section="hero", field="title")
        const [section, field] = key.includes('.') ? key.split('.') : [slug, key];
        await updateContent(section, field, value, language);
      }
      
      toast({
        title: "Сохранено",
        description: "Контент страницы успешно сохранен",
      });
      
      // Update content status
      const hasContent = Object.values(formData).some(value => value.trim() !== '');
      onContentChange(hasContent);
      
    } catch (error) {
      console.error('Error saving page content:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить контент",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Загрузка контента...</span>
      </div>
    );
  }

  const fields = getPageFields(slug);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Редактирование: {slug} ({language === 'ru' ? 'Русский' : 'English'})
          </h3>
          <p className="text-sm text-muted-foreground">
            Заполните поля контента для страницы
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Сохранить
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.entries(fields).map(([key, label]) => {
          const value = formData[key] || '';
          const isTextarea = key.includes('description') || key.includes('content') || key.includes('subtitle') || value.length > 100;
          
          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <Label htmlFor={key} className="text-sm font-medium">
                  {String(label)}
                </Label>
                <CardDescription className="text-xs">
                  Ключ: {key}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTextarea ? (
                  <Textarea
                    id={key}
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={`Введите ${String(label).toLowerCase()}`}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={`Введите ${String(label).toLowerCase()}`}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(fields).length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Для страницы "{slug}" не определены поля контента.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageContentEditor;