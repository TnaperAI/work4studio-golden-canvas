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

const ServicesContentManagement = () => {
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
      id: 'services',
      title: 'Главный блок (Hero)',
      description: 'Основной заголовок и описание на странице услуг',
      fields: [
        { key: 'title', label: 'Главный заголовок', type: 'text' },
        { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
        { key: 'badge_1_text', label: 'Бейдж 1 - текст', type: 'text' },
        { key: 'badge_2_text', label: 'Бейдж 2 - текст', type: 'text' },
        { key: 'grid_title', label: 'Заголовок секции выбора формата', type: 'text' },
        { key: 'grid_subtitle', label: 'Подзаголовок секции выбора формата', type: 'textarea' },
        { key: 'cta_title', label: 'CTA заголовок', type: 'text' },
        { key: 'cta_subtitle', label: 'CTA подзаголовок', type: 'textarea' },
        { key: 'cta_button', label: 'CTA кнопка', type: 'text' }
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
            Контент страницы услуг ({currentLanguage.toUpperCase()})
          </h1>
          <p className="text-muted-foreground">
            Управление текстовым контентом на странице /services
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

export default ServicesContentManagement;