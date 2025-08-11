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

  // Define content structure for each page
  const getPageFields = (pageSlug: string) => {
    const commonFields = {
      'home': {
        'hero.title': 'Заголовок героя',
        'hero.subtitle': 'Подзаголовок героя', 
        'hero.description': 'Описание героя',
        'hero.cta': 'Текст кнопки',
        'advantages.title': 'Заголовок преимуществ',
        'advantages.subtitle': 'Подзаголовок преимуществ',
        'services.title': 'Заголовок услуг',
        'services.subtitle': 'Подзаголовок услуг'
      },
      'about': {
        'title': 'Заголовок страницы',
        'description': 'Описание компании',
        'mission': 'Миссия',
        'vision': 'Видение',
        'history': 'История компании'
      },
      'contact': {
        'title': 'Заголовок страницы',
        'description': 'Описание контактов',
        'address': 'Адрес',
        'phone': 'Телефон',
        'email': 'Email',
        'form.title': 'Заголовок формы'
      },
      'services-page': {
        'title': 'Заголовок страницы',
        'description': 'Описание услуг',
        'cta.title': 'Заголовок CTA',
        'cta.description': 'Описание CTA'
      }
    };

    return commonFields[pageSlug as keyof typeof commonFields] || {};
  };

  useEffect(() => {
    const fetchPageContent = async () => {
      setIsLoading(true);
      
      try {
        const fields = getPageFields(slug);
        const data: Record<string, string> = {};
        
        // Fetch content for each field
        for (const [key, label] of Object.entries(fields)) {
          const value = content.find(item => 
            item.section === slug && 
            item.key === key && 
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
        await updateContent(slug, key, value, language);
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
          const isTextarea = key.includes('description') || key.includes('content') || value.length > 100;
          
          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <Label htmlFor={key} className="text-sm font-medium">
                  {String(label)}
                </Label>
                <CardDescription className="text-xs">
                  Ключ: {slug}.{key}
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