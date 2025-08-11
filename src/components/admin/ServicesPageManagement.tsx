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
  Award,
  List,
  Star,
  PlusCircle,
  Grid3X3,
  MapPin
} from 'lucide-react';

interface ServicesPageManagementProps {
  language?: 'ru' | 'en';
}

const ServicesPageManagement = ({ language: propLanguage }: ServicesPageManagementProps) => {
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

  const handleInputChange = (section: string, key: string, value: string) => {
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
      for (const section of Object.keys(formData)) {
        for (const [key, value] of Object.entries(formData[section])) {
          await updateContent(section, key, value, currentLanguage);
        }
      }
      
      toast({
        title: 'Контент сохранен',
        description: 'Все изменения успешно сохранены в базе данных'
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
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
      toast({
        title: 'Данные сброшены',
        description: 'Форма возвращена к сохраненному состоянию'
      });
    }
  };

  const sections = [
    {
      id: 'services_page',
      title: 'Главный блок страницы услуг',
      emoji: '🎯',
      icon: Target,
      description: 'Заголовок, подзаголовок и хлебные крошки страницы услуг',
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { key: 'breadcrumb_home', label: 'Хлебная крошка: Главная', type: 'text' },
        { key: 'breadcrumb_services', label: 'Хлебная крошка: Услуги', type: 'text' },
        { key: 'title', label: 'Заголовок страницы', type: 'text' },
        { key: 'subtitle', label: 'Подзаголовок страницы', type: 'textarea' },
        { key: 'description', label: 'Описание страницы', type: 'textarea' }
      ]
    },
    {
      id: 'services',
      title: 'Блок списка услуг',
      emoji: '⚡',
      icon: Zap,
      description: 'Заголовки и описание для блока с сеткой услуг',
      color: 'from-yellow-500 to-orange-500',
      fields: [
        { key: 'title', label: 'Заголовок блока услуг', type: 'text' },
        { key: 'subtitle', label: 'Подзаголовок блока услуг', type: 'textarea' },
        { key: 'main_title', label: 'Основной заголовок', type: 'text' },
        { key: 'main_description', label: 'Основное описание', type: 'textarea' },
        { key: 'grid_title', label: 'Заголовок сетки услуг', type: 'text' },
        { key: 'grid_subtitle', label: 'Подзаголовок сетки услуг', type: 'textarea' },
        { key: 'features', label: 'Особенности услуг', type: 'textarea' }
      ]
    },
    {
      id: 'services',
      title: 'Блок CTA (Призыв к действию)',
      emoji: '🚀',
      icon: PlusCircle,
      description: 'Заголовки и кнопки для блока призыва к действию',
      color: 'from-purple-500 to-pink-500',
      fields: [
        { key: 'cta_title', label: 'Заголовок CTA', type: 'text' },
        { key: 'cta_subtitle', label: 'Подзаголовок CTA', type: 'textarea' },
        { key: 'cta_button', label: 'Текст кнопки CTA', type: 'text' },
        { key: 'button', label: 'Текст кнопки (альтернативный)', type: 'text' },
        { key: 'button_text', label: 'Дополнительный текст кнопки', type: 'text' }
      ]
    },
    {
      id: 'services',
      title: 'Бейджи и дополнительные элементы',
      emoji: '🏆',
      icon: Award,
      description: 'Бейджи, награды и дополнительные элементы страницы',
      color: 'from-emerald-500 to-teal-500',
      fields: [
        { key: 'badge_1_text', label: 'Текст первого бейджа', type: 'text' },
        { key: 'badge_2_text', label: 'Текст второго бейджа', type: 'text' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Управление страницей "Услуги"
          </h1>
          <p className="text-muted-foreground mt-2">
            Редактируйте контент для языка: {currentLanguage === 'ru' ? '🇷🇺 Русский' : '🇺🇸 English'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {sections.map((section, sectionIndex) => {
          const IconComponent = section.icon;
          return (
            <Card key={`${section.id}-${sectionIndex}`} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <CardTitle className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{section.emoji}</span>
                      <span>{section.title}</span>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-base relative z-10 ml-16">
                  {section.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {section.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label 
                        htmlFor={`${section.id}-${field.key}`}
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"></span>
                        {field.label}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={`${section.id}-${field.key}`}
                          value={formData[section.id]?.[field.key] || ''}
                          onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                          placeholder={`Введите ${field.label.toLowerCase()}`}
                          rows={3}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <Input
                          id={`${section.id}-${field.key}`}
                          value={formData[section.id]?.[field.key] || ''}
                          onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                          placeholder={`Введите ${field.label.toLowerCase()}`}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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

export default ServicesPageManagement;