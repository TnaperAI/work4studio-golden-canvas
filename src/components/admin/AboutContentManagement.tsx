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
  BarChart3, 
  Award,
  Heart,
  Users,
  Zap,
  Building
} from 'lucide-react';

interface AboutContentManagementProps {
  language?: 'ru' | 'en';
}

const AboutContentManagement = ({ language: propLanguage }: AboutContentManagementProps) => {
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
      id: 'about',
      title: 'Главный блок',
      emoji: '🏢',
      icon: Building,
      description: 'Заголовок страницы, навигация и основная информация',
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { key: 'hero_title_1', label: 'Заголовок (часть 1)', type: 'text' },
        { key: 'hero_title_2', label: 'Заголовок (часть 2)', type: 'text' },
        { key: 'breadcrumb_home', label: 'Хлебные крошки - Главная', type: 'text' },
        { key: 'breadcrumb_about', label: 'Хлебные крошки - О нас', type: 'text' }
      ]
    },
    {
      id: 'about',
      title: 'Статистика компании',
      emoji: '📊',
      icon: BarChart3,
      description: 'Ключевые показатели и достижения компании',
      color: 'from-green-500 to-emerald-500',
      fields: [
        { key: 'stats_founding_year_label', label: 'Подпись "Год основания"', type: 'text' },
        { key: 'stats_team_label', label: 'Подпись "Команда"', type: 'text' },
        { key: 'stats_projects_label', label: 'Подпись "Проекты"', type: 'text' },
        { key: 'stats_clients_label', label: 'Подпись "Клиенты"', type: 'text' }
      ]
    },
    {
      id: 'about',
      title: 'Миссия и видение',
      emoji: '🎯',
      icon: Target,
      description: 'Цели и видение развития компании',
      color: 'from-purple-500 to-violet-500',
      fields: [
        { key: 'mission_title', label: 'Заголовок "Миссия"', type: 'text' },
        { key: 'mission_text', label: 'Текст миссии', type: 'textarea' },
        { key: 'vision_title', label: 'Заголовок "Видение"', type: 'text' },
        { key: 'vision_text', label: 'Текст видения', type: 'textarea' }
      ]
    },
    {
      id: 'about',
      title: 'Наши ценности',
      emoji: '⭐',
      icon: Award,
      description: 'Принципы и ценности компании',
      color: 'from-amber-500 to-yellow-500',
      fields: [
        { key: 'values_title', label: 'Заголовок секции (часть 1)', type: 'text' },
        { key: 'values_title_second', label: 'Заголовок секции (часть 2)', type: 'text' },
        { key: 'values_subtitle', label: 'Описание секции', type: 'textarea' },
        { key: 'value_1_title', label: 'Ценность 1 - заголовок', type: 'text' },
        { key: 'value_1_description', label: 'Ценность 1 - описание', type: 'textarea' },
        { key: 'value_2_title', label: 'Ценность 2 - заголовок', type: 'text' },
        { key: 'value_2_description', label: 'Ценность 2 - описание', type: 'textarea' },
        { key: 'value_3_title', label: 'Ценность 3 - заголовок', type: 'text' },
        { key: 'value_3_description', label: 'Ценность 3 - описание', type: 'textarea' },
        { key: 'value_4_title', label: 'Ценность 4 - заголовок', type: 'text' },
        { key: 'value_4_description', label: 'Ценность 4 - описание', type: 'textarea' }
      ]
    },
    {
      id: 'about',
      title: 'Блок команды',
      emoji: '👥',
      icon: Users,
      description: 'Заголовки и описания для секции команды',
      color: 'from-teal-500 to-cyan-500',
      fields: [
        { key: 'team_title_first', label: 'Заголовок (часть 1)', type: 'text' },
        { key: 'team_title_second', label: 'Заголовок (часть 2)', type: 'text' },
        { key: 'team_subtitle', label: 'Описание под заголовком', type: 'textarea' }
      ]
    },
    {
      id: 'about',
      title: 'Призыв к действию',
      emoji: '⚡',
      icon: Zap,
      description: 'CTA блок в конце страницы',
      color: 'from-orange-500 to-red-500',
      fields: [
        { key: 'cta_title_first', label: 'Заголовок CTA (часть 1)', type: 'text' },
        { key: 'cta_title_second', label: 'Заголовок CTA (часть 2)', type: 'text' },
        { key: 'cta_subtitle', label: 'Описание CTA', type: 'textarea' },
        { key: 'cta_button_text', label: 'Текст кнопки', type: 'text' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Контент страницы "О нас" ({currentLanguage === 'ru' ? 'Русский' : 'English'})
          </h1>
          <p className="text-muted-foreground">
            Управление текстовым контентом на странице "О нас"
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
            <Card key={`${section.id}-${index}`} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
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
                {section.title === 'Блок команды' && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Управление участниками команды</h4>
                        <p className="text-sm text-muted-foreground">
                          Добавляйте, редактируйте и управляйте участниками команды
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.hash = 'team'}
                        className="shrink-0"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Управление командой
                      </Button>
                    </div>
                  </div>
                )}
                
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

export default AboutContentManagement;