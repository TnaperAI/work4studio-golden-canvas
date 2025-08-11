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
  Mail, 
  Phone, 
  Clock,
  MapPin,
  MessageSquare,
  Settings,
  Globe,
  User,
  Send,
  Sparkles
} from 'lucide-react';

interface ContactPageManagementProps {
  language?: 'ru' | 'en';
}

const ContactPageManagement = ({ language: propLanguage }: ContactPageManagementProps) => {
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
      id: 'contact',
      title: 'Главный блок контактов',
      emoji: '📬',
      icon: Mail,
      description: 'Основной заголовок и хлебные крошки страницы контактов',
      color: 'from-blue-500 to-cyan-500',
      fields: [
        { key: 'breadcrumb_home', label: 'Хлебная крошка: Главная', type: 'text' },
        { key: 'breadcrumb_contact', label: 'Хлебная крошка: Контакты', type: 'text' },
        { key: 'title', label: 'Заголовок страницы', type: 'text' },
        { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
        { key: 'hero_title_1', label: 'Заголовок Hero - часть 1', type: 'text' },
        { key: 'hero_title_2', label: 'Заголовок Hero - часть 2', type: 'text' },
        { key: 'hero_subtitle', label: 'Подзаголовок Hero', type: 'text' },
        { key: 'hero_benefit_1', label: 'Преимущество 1', type: 'text' },
        { key: 'hero_benefit_2', label: 'Преимущество 2', type: 'text' }
      ]
    },
    {
      id: 'contact',
      title: 'Контактная информация',
      emoji: '📞',
      icon: Phone,
      description: 'Основные контактные данные компании',
      color: 'from-emerald-500 to-teal-500',
      fields: [
        { key: 'email', label: 'Email адрес', type: 'text' },
        { key: 'email_title', label: 'Заголовок для Email', type: 'text' },
        { key: 'phone', label: 'Номер телефона', type: 'text' },
        { key: 'phone_title', label: 'Заголовок для телефона', type: 'text' },
        { key: 'address', label: 'Адрес', type: 'textarea' },
        { key: 'address_title', label: 'Заголовок для адреса', type: 'text' }
      ]
    },
    {
      id: 'contact',
      title: 'Форма обратной связи',
      emoji: '✉️',
      icon: MessageSquare,
      description: 'Настройки формы для отправки сообщений',
      color: 'from-violet-500 to-purple-500',
      fields: [
        { key: 'form_title', label: 'Заголовок формы', type: 'text' },
        { key: 'form_subtitle', label: 'Описание формы', type: 'textarea' },
        { key: 'form_name_placeholder', label: 'Placeholder для имени', type: 'text' },
        { key: 'form_email_placeholder', label: 'Placeholder для email', type: 'text' },
        { key: 'form_phone_placeholder', label: 'Placeholder для телефона', type: 'text' },
        { key: 'form_message_placeholder', label: 'Placeholder для сообщения', type: 'text' },
        { key: 'form_button_text', label: 'Текст кнопки отправки', type: 'text' },
        { key: 'form_success_message', label: 'Сообщение об успехе', type: 'textarea' },
        { key: 'form_error_message', label: 'Сообщение об ошибке', type: 'text' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            Управление страницей "Контакты"
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

      <Card className="bg-muted/30 border-dashed border-2 border-muted-foreground/20">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Дополнительные настройки</h3>
              <p className="text-muted-foreground mb-6">
                Управляйте SEO настройками и заявками с формы контактов
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.hash = 'seo'}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  SEO настройки
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.hash = 'submissions'}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Управление заявками
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPageManagement;