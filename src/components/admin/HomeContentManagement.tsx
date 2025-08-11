import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Save, 
  RotateCcw, 
  Target, 
  Zap, 
  BarChart3, 
  Wrench, 
  Star, 
  Smartphone, 
  Mail, 
  Navigation 
} from 'lucide-react';

interface HomeContentManagementProps {
  language?: 'ru' | 'en';
}

const HomeContentManagement = ({ language: propLanguage }: HomeContentManagementProps) => {
  const { content, getContent, updateContent } = useSiteContent();
  const { toast } = useToast();
  const { language: contextLanguage } = useLanguage();
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Use prop language if provided, otherwise use context language
  const currentLanguage = propLanguage || contextLanguage;

  // Инициализируем данные формы из контента
  useEffect(() => {
    if (content.length > 0) {
      const groupedContent: Record<string, Record<string, string>> = {};
      
      content.forEach(item => {
        if (item.language === currentLanguage) {
          if (!groupedContent[item.section]) {
            groupedContent[item.section] = {};
          }
          groupedContent[item.section][item.key] = item.value;
        }
      });
      
      setFormData(groupedContent);
    }
  }, [content, currentLanguage]);

  const handleChange = (section: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updates = [];
      
      Object.entries(formData).forEach(([section, sectionData]) => {
        Object.entries(sectionData).forEach(([key, value]) => {
          updates.push(updateContent(section, key, value, currentLanguage));
        });
      });

      await Promise.all(updates);
      
      toast({
        title: 'Контент обновлен',
        description: `Изменения успешно сохранены (${currentLanguage === 'ru' ? 'Русский' : 'English'})`
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const groupedContent: Record<string, Record<string, string>> = {};
    
    content.forEach(item => {
      if (item.language === currentLanguage) {
        if (!groupedContent[item.section]) {
          groupedContent[item.section] = {};
        }
        groupedContent[item.section][item.key] = item.value;
      }
    });
    
    setFormData(groupedContent);
    
    toast({
      title: 'Изменения отменены',
      description: 'Данные восстановлены из базы'
    });
  };

  const sections = [
    {
      id: 'hero',
      title: 'Главный блок',
      emoji: '🎯',
      icon: Target,
      description: 'Основной заголовок, подзаголовок и статистика на главной странице',
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
        { key: 'cta_button', label: 'Текст кнопки', type: 'text' },
        { key: 'stats_projects', label: 'Статистика - проекты (число)', type: 'text' },
        { key: 'stats_projects_label', label: 'Статистика - проекты (текст)', type: 'text' },
        { key: 'stats_clients', label: 'Статистика - клиенты (число)', type: 'text' },
        { key: 'stats_clients_label', label: 'Статистика - клиенты (текст)', type: 'text' },
        { key: 'stats_experience', label: 'Статистика - опыт (число)', type: 'text' },
        { key: 'stats_experience_label', label: 'Статистика - опыт (текст)', type: 'text' },
        { key: 'advantage_1_title', label: 'Преимущество 1 - заголовок', type: 'text' },
        { key: 'advantage_1_description', label: 'Преимущество 1 - описание', type: 'textarea' },
        { key: 'advantage_2_title', label: 'Преимущество 2 - заголовок', type: 'text' },
        { key: 'advantage_2_description', label: 'Преимущество 2 - описание', type: 'textarea' },
        { key: 'advantage_3_title', label: 'Преимущество 3 - заголовок', type: 'text' },
        { key: 'advantage_3_description', label: 'Преимущество 3 - описание', type: 'textarea' },
        { key: 'advantage_4_title', label: 'Преимущество 4 - заголовок', type: 'text' },
        { key: 'advantage_4_description', label: 'Преимущество 4 - описание', type: 'textarea' }
      ]
    },
    {
      id: 'cta',
      title: 'Блок призыва к действию',
      emoji: '⚡',
      icon: Zap,
      description: 'Заголовки и кнопки в блоке CTA',
      color: 'from-yellow-500 to-orange-500',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание', type: 'textarea' },
        { key: 'button', label: 'Основная кнопка', type: 'text' },
        { key: 'email_button', label: 'Кнопка Email', type: 'text' }
      ]
    },
    {
      id: 'stats',
      title: 'Статистика',
      emoji: '📊',
      icon: BarChart3,
      description: 'Числовые показатели под главным блоком',
      color: 'from-green-500 to-emerald-500',
      fields: [
        { key: 'days', label: 'Количество дней', type: 'text' },
        { key: 'days_text', label: 'Описание для дней', type: 'text' },
        { key: 'projects', label: 'Количество проектов', type: 'text' },
        { key: 'projects_text', label: 'Описание проектов', type: 'text' },
        { key: 'satisfaction', label: 'Процент довольных клиентов', type: 'text' },
        { key: 'satisfaction_text', label: 'Описание удовлетворенности', type: 'text' },
        { key: 'support', label: 'Поддержка', type: 'text' },
        { key: 'support_text', label: 'Описание поддержки', type: 'text' },
        { key: 'code', label: 'Код (%)', type: 'text' },
        { key: 'code_text', label: 'Описание кода', type: 'text' }
      ]
    },
    {
      id: 'services',
      title: 'Блок услуг',
      emoji: '🛠️',
      icon: Wrench,
      description: 'Информация о разделе услуг на главной странице',
      color: 'from-purple-500 to-violet-500',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание', type: 'textarea' },
        { key: 'main_title', label: 'Основной заголовок услуги', type: 'text' },
        { key: 'main_description', label: 'Описание услуги', type: 'textarea' },
        { key: 'features', label: 'Особенности (через запятую)', type: 'textarea' },
        { key: 'button', label: 'Текст кнопки', type: 'text' },
        { key: 'grid_title', label: 'Заголовок сетки услуг', type: 'text' },
        { key: 'grid_subtitle', label: 'Описание сетки услуг', type: 'textarea' },
        { key: 'badge_1_text', label: 'Бейдж 1', type: 'text' },
        { key: 'badge_2_text', label: 'Бейдж 2', type: 'text' },
        { key: 'cta_title', label: 'CTA заголовок', type: 'text' },
        { key: 'cta_subtitle', label: 'CTA описание', type: 'textarea' },
        { key: 'cta_button', label: 'CTA кнопка', type: 'text' }
      ]
    },
    {
      id: 'advantages',
      title: 'Преимущества',
      emoji: '⭐',
      icon: Star,
      description: 'Блок с преимуществами компании',
      color: 'from-amber-500 to-yellow-500',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание', type: 'textarea' },
        { key: '1_title', label: 'Преимущество 1 - заголовок', type: 'text' },
        { key: '1_description', label: 'Преимущество 1 - описание', type: 'textarea' },
        { key: '2_title', label: 'Преимущество 2 - заголовок', type: 'text' },
        { key: '2_description', label: 'Преимущество 2 - описание', type: 'textarea' },
        { key: '3_title', label: 'Преимущество 3 - заголовок', type: 'text' },
        { key: '3_description', label: 'Преимущество 3 - описание', type: 'textarea' },
        { key: '4_title', label: 'Преимущество 4 - заголовок', type: 'text' },
        { key: '4_description', label: 'Преимущество 4 - описание', type: 'textarea' }
      ]
    },
    {
      id: 'cases',
      title: 'Блок кейсов',
      emoji: '📱',
      icon: Smartphone,
      description: 'Заголовки и описания для раздела кейсов',
      color: 'from-pink-500 to-rose-500',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание', type: 'textarea' },
        { key: 'button', label: 'Текст кнопки', type: 'text' }
      ]
    },
    {
      id: 'contact',
      title: 'Блок контактной формы',
      emoji: '✉️',
      icon: Mail,
      description: 'Заголовки и тексты в блоке обратной связи',
      color: 'from-teal-500 to-cyan-500',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание под заголовком', type: 'textarea' },
        { key: 'form_name_label', label: 'Подпись к полю "Имя"', type: 'text' },
        { key: 'form_name_placeholder', label: 'Плейсхолдер поля "Имя"', type: 'text' },
        { key: 'form_email_label', label: 'Подпись к полю "Email"', type: 'text' },
        { key: 'form_message_label', label: 'Подпись к полю "Сообщение"', type: 'text' },
        { key: 'form_message_placeholder', label: 'Плейсхолдер поля "Сообщение"', type: 'text' },
        { key: 'form_submit_button', label: 'Текст кнопки отправки', type: 'text' },
        { key: 'contact_title', label: 'Заголовок правой колонки', type: 'text' },
        { key: 'contact_subtitle', label: 'Описание правой колонки', type: 'textarea' },
        { key: 'contact_telegram_text', label: 'Текст для Telegram', type: 'text' },
        { key: 'contact_phone_text', label: 'Текст для телефона', type: 'text' },
        { key: 'contact_quick_response_text', label: 'Текст быстрого ответа', type: 'text' }
      ]
    },
    {
      id: 'header',
      title: 'Навигация сайта',
      emoji: '🧭',
      icon: Navigation,
      description: 'Тексты меню и кнопок в шапке сайта',
      color: 'from-indigo-500 to-blue-500',
      fields: [
        { key: 'nav_home', label: 'Главная', type: 'text' },
        { key: 'nav_services', label: 'Услуги', type: 'text' },
        { key: 'nav_cases', label: 'Кейсы', type: 'text' },
        { key: 'nav_about', label: 'О нас', type: 'text' },
        { key: 'nav_contact', label: 'Контакты', type: 'text' },
        { key: 'cta_button', label: 'CTA кнопка в шапке', type: 'text' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Контент главной страницы ({currentLanguage === 'ru' ? 'Русский' : 'English'})
          </h1>
          <p className="text-muted-foreground">
            Управление текстовым контентом на главной странице сайта
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Отменить
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.id} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
              {/* Gradient background */}
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${section.color}`}></div>
              
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-heading flex items-center gap-3">
                      <span className="text-2xl">{section.emoji}</span>
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2 text-muted-foreground">
                      {section.description}
                    </CardDescription>
                  </div>
                  
                  {/* Block number */}
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={field.key} className="space-y-2">
                      <Label 
                        htmlFor={`${section.id}-${field.key}`}
                        className="text-sm font-semibold text-foreground"
                      >
                        {field.label}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={`${section.id}-${field.key}`}
                          value={formData[section.id]?.[field.key] || ''}
                          onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                          rows={3}
                          className="resize-none border-border focus:border-primary transition-colors"
                          placeholder={`Введите ${field.label.toLowerCase()}...`}
                        />
                      ) : (
                        <Input
                          id={`${section.id}-${field.key}`}
                          value={formData[section.id]?.[field.key] || ''}
                          onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                          className="border-border focus:border-primary transition-colors"
                          placeholder={`Введите ${field.label.toLowerCase()}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomeContentManagement;