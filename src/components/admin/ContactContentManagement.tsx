import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  RotateCcw, 
  Mail, 
  Phone, 
  Clock,
  MapPin,
  MessageSquare,
  Settings,
  Globe
} from 'lucide-react';

interface ContactContentManagementProps {
  language?: 'ru' | 'en';
}

const ContactContentManagement = ({ language: propLanguage }: ContactContentManagementProps) => {
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
      id: 'contact_breadcrumb',
      title: 'Хлебные крошки',
      icon: MapPin,
      fields: [
        { key: 'breadcrumb_home', label: 'Главная', placeholder: 'Главная / Home' },
        { key: 'breadcrumb_contact', label: 'Контакты', placeholder: 'Контакты / Contacts' },
      ]
    },
    {
      id: 'contact_hero',
      title: 'Hero блок',
      icon: MessageSquare,
      fields: [
        { key: 'hero_title_1', label: 'Заголовок, часть 1', placeholder: 'Обсудим ваш / Let\'s discuss your' },
        { key: 'hero_title_2', label: 'Заголовок, часть 2', placeholder: 'проект? / project?' },
        { key: 'hero_subtitle', label: 'Подзаголовок', placeholder: 'Готовы воплотить вашу идею в жизнь' },
        { key: 'hero_description', label: 'Описание', placeholder: 'Мы создаем современные веб-решения...' }
      ]
    },
    {
      id: 'contact_info',
      title: 'Контактная информация',
      icon: Phone,
      fields: [
        { key: 'contact_email', label: 'Email', placeholder: 'contact@example.com' },
        { key: 'contact_phone', label: 'Телефон', placeholder: '+7 (999) 123-45-67' },
        { key: 'contact_hours', label: 'Часы работы', placeholder: 'Пн-Пт: 9:00 - 18:00' },
        { key: 'contact_address', label: 'Адрес', placeholder: 'г. Москва, ул. Примерная, д. 1' }
      ]
    },
    {
      id: 'contact_form',
      title: 'Форма обратной связи',
      icon: Mail,
      fields: [
        { key: 'form_title', label: 'Заголовок формы', placeholder: 'Отправьте нам сообщение' },
        { key: 'form_description', label: 'Описание формы', placeholder: 'Заполните форму и мы свяжемся с вами' },
        { key: 'form_name_label', label: 'Метка "Имя"', placeholder: 'Ваше имя' },
        { key: 'form_email_label', label: 'Метка "Email"', placeholder: 'Ваш email' },
        { key: 'form_phone_label', label: 'Метка "Телефон"', placeholder: 'Ваш телефон' },
        { key: 'form_message_label', label: 'Метка "Сообщение"', placeholder: 'Ваше сообщение' },
        { key: 'form_submit_button', label: 'Кнопка отправки', placeholder: 'Отправить сообщение' },
        { key: 'form_success_message', label: 'Сообщение об успехе', placeholder: 'Спасибо! Мы получили ваше сообщение' },
        { key: 'form_error_message', label: 'Сообщение об ошибке', placeholder: 'Произошла ошибка при отправке' }
      ]
    },
    {
      id: 'contact_features',
      title: 'Преимущества',
      icon: Clock,
      fields: [
        { key: 'features_title', label: 'Заголовок блока', placeholder: 'Почему стоит выбрать нас' },
        { key: 'feature_1_title', label: 'Преимущество 1 - Заголовок', placeholder: 'Быстрый ответ' },
        { key: 'feature_1_description', label: 'Преимущество 1 - Описание', placeholder: 'Отвечаем в течение часа' },
        { key: 'feature_2_title', label: 'Преимущество 2 - Заголовок', placeholder: 'Бесплатная консультация' },
        { key: 'feature_2_description', label: 'Преимущество 2 - Описание', placeholder: 'Первая консультация бесплатно' },
        { key: 'feature_3_title', label: 'Преимущество 3 - Заголовок', placeholder: 'Поддержка проекта' },
        { key: 'feature_3_description', label: 'Преимущество 3 - Описание', placeholder: '3 месяца бесплатной поддержки' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <Mail className="h-8 w-8" />
            Управление страницей "Контакты"
          </h1>
          <p className="text-muted-foreground">
            Редактируйте контент страницы контактов для языка: {currentLanguage === 'ru' ? '🇷🇺 Русский' : '🇺🇸 English'}
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

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">
            <Globe className="h-4 w-4 mr-2" />
            Контент страницы
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    Настройте контент для раздела "{section.title}"
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`${section.id}-${field.key}`}>
                          {field.label}
                        </Label>
                        {field.key.includes('description') || field.key.includes('message') ? (
                          <Textarea
                            id={`${section.id}-${field.key}`}
                            value={formData[section.id]?.[field.key] || ''}
                            onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={`${section.id}-${field.key}`}
                            value={formData[section.id]?.[field.key] || ''}
                            onChange={(e) => handleInputChange(section.id, field.key, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-6 w-6" />
                Дополнительные настройки
              </CardTitle>
              <CardDescription>
                Управление дополнительными параметрами страницы контактов
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed border-primary/20">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">SEO настройки</h3>
                  <p className="text-muted-foreground mb-4">
                    Для управления SEO настройками страницы контактов используйте раздел "SEO страниц"
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.hash = 'seo'}
                  >
                    Перейти к SEO настройкам
                  </Button>
                </div>
              </div>
              
              <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed border-primary/20">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Заявки с формы</h3>
                  <p className="text-muted-foreground mb-4">
                    Просматривайте и управляйте заявками, поступающими с формы обратной связи
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.hash = 'submissions'}
                  >
                    Управление заявками
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactContentManagement;