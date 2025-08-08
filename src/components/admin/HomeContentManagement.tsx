import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { LanguageSwitcher } from '@/components/admin/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Save, RotateCcw } from 'lucide-react';

const HomeContentManagement = () => {
  const { content, getContent, updateContent } = useSiteContent();
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Инициализируем данные формы из контента для текущего языка
  useEffect(() => {
    if (content.length > 0) {
      const groupedContent: Record<string, Record<string, string>> = {};
      
      // Фильтруем контент по текущему языку
      const currentLanguageContent = content.filter(item => item.language === currentLanguage);
      
      currentLanguageContent.forEach(item => {
        if (!groupedContent[item.section]) {
          groupedContent[item.section] = {};
        }
        groupedContent[item.section][item.key] = item.value;
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
          updates.push(updateContent(section, key, value));
        });
      });

      await Promise.all(updates);
      
      toast({
        title: 'Контент обновлен',
        description: 'Изменения успешно сохранены'
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
    
    // Фильтруем контент по текущему языку для сброса
    const currentLanguageContent = content.filter(item => item.language === currentLanguage);
    
    currentLanguageContent.forEach(item => {
      if (!groupedContent[item.section]) {
        groupedContent[item.section] = {};
      }
      groupedContent[item.section][item.key] = item.value;
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
      title: 'Главный блок (Hero)',
      description: 'Основной заголовок и описание на главной странице',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
        { key: 'cta_button', label: 'Текст кнопки', type: 'text' }
      ]
    },
    {
      id: 'stats',
      title: 'Статистика',
      description: 'Числовые показатели под главным блоком',
      fields: [
        { key: 'days', label: 'Количество дней', type: 'text' },
        { key: 'days_text', label: 'Описание для дней', type: 'text' },
        { key: 'support', label: 'Поддержка', type: 'text' },
        { key: 'support_text', label: 'Описание поддержки', type: 'text' },
        { key: 'code', label: 'Код (%)', type: 'text' },
        { key: 'code_text', label: 'Описание кода', type: 'text' }
      ]
    },
    {
      id: 'services',
      title: 'Блок услуг',
      description: 'Информация о разделе услуг',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание', type: 'textarea' },
        { key: 'main_title', label: 'Основной заголовок услуги', type: 'text' },
        { key: 'main_description', label: 'Описание услуги', type: 'textarea' },
        { key: 'features', label: 'Особенности (через запятую)', type: 'textarea' },
        { key: 'button', label: 'Текст кнопки', type: 'text' }
      ]
    },
    {
      id: 'advantages',
      title: 'Преимущества',
      description: 'Блок с преимуществами компании',
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
      description: 'Заголовки и описания для раздела кейсов',
      fields: [
        { key: 'title', label: 'Заголовок', type: 'text' },
        { key: 'subtitle', label: 'Описание', type: 'textarea' },
        { key: 'button', label: 'Текст кнопки', type: 'text' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Контент главной страницы ({currentLanguage.toUpperCase()})
          </h1>
          <p className="text-muted-foreground">
            Управление текстовым контентом на главной странице сайта
          </p>
        </div>
        <div className="flex gap-2">
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

      <div className="grid gap-6">
        {sections.map(section => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map(field => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={`${section.id}-${field.key}`}
                      value={formData[section.id]?.[field.key] || ''}
                      onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  ) : (
                    <Input
                      id={`${section.id}-${field.key}`}
                      value={formData[section.id]?.[field.key] || ''}
                      onChange={(e) => handleChange(section.id, field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeContentManagement;