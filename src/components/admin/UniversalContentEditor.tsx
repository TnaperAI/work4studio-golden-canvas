import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageContentEditor from './PageContentEditor';

interface UniversalContentEditorProps {
  type: 'page' | 'service' | 'case' | 'legal';
  id?: string;
  slug?: string;
  onBack: () => void;
}

const UniversalContentEditor = ({ type, id, slug, onBack }: UniversalContentEditorProps) => {
  const [activeTab, setActiveTab] = useState<'ru' | 'en'>('ru');
  const [hasRussianContent, setHasRussianContent] = useState(false);
  const [hasEnglishContent, setHasEnglishContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const { toast } = useToast();


  const getEditorTitle = () => {
    const titles = {
      page: 'Редактирование страницы',
      service: id ? 'Редактирование услуги' : 'Создание услуги',
      case: id ? 'Редактирование кейса' : 'Создание кейса',
      legal: id ? 'Редактирование документа' : 'Создание документа'
    };
    return titles[type];
  };

  const getEditorIcon = () => {
    switch (type) {
      case 'page': return <Globe className="h-5 w-5" />;
      case 'service': return <Globe className="h-5 w-5" />;
      case 'case': return <Globe className="h-5 w-5" />;
      case 'legal': return <Globe className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const renderContentEditor = () => {
    const commonProps = {
      language: activeTab,
      onContentChange: (hasContent: boolean) => {
        if (activeTab === 'ru') {
          setHasRussianContent(hasContent);
        } else {
          setHasEnglishContent(hasContent);
        }
      },
      onTitleChange: setTitle
    };

    switch (type) {
      case 'page':
        return <PageContentEditor slug={slug!} {...commonProps} />;
      case 'service':
        return (
          <div className="p-6 border border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">
              Редактор услуги #{id} (язык: {activeTab})
              <br />
              <span className="text-sm">Компонент в разработке</span>
            </p>
          </div>
        );
      case 'case':
        return (
          <div className="p-6 border border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">
              Редактор кейса #{id} (язык: {activeTab})
              <br />
              <span className="text-sm">Компонент в разработке</span>
            </p>
          </div>
        );
      case 'legal':
        return (
          <div className="p-6 border border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">
              Редактор документа #{id} (язык: {activeTab})
              <br />
              <span className="text-sm">Компонент в разработке</span>
            </p>
          </div>
        );
      default:
        return <div>Неизвестный тип контента</div>;
    }
  };

  const getTranslationStatus = (lang: 'ru' | 'en') => {
    const hasContent = lang === 'ru' ? hasRussianContent : hasEnglishContent;
    return hasContent ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save logic will be handled by individual editors
      toast({
        title: "Сохранено",
        description: "Контент успешно сохранен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить контент",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    // Implement preview logic
    toast({
      title: "Предпросмотр",
      description: "Функция предпросмотра в разработке",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div className="flex items-center space-x-3">
            {getEditorIcon()}
            <div>
              <h1 className="text-2xl font-heading font-bold">{getEditorTitle()}</h1>
              {title && <p className="text-muted-foreground">{title}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Предпросмотр
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* Translation Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Статус переводов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getTranslationStatus('ru')}
              <span className="text-sm">Русский</span>
              {hasRussianContent && <Badge variant="default">Готов</Badge>}
            </div>
            <div className="flex items-center space-x-2">
              {getTranslationStatus('en')}
              <span className="text-sm">English</span>
              {hasEnglishContent && <Badge variant="default">Готов</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'ru' | 'en')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ru" className="flex items-center gap-2">
            {getTranslationStatus('ru')}
            Русский
          </TabsTrigger>
          <TabsTrigger value="en" className="flex items-center gap-2">
            {getTranslationStatus('en')}
            English
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ru" className="space-y-6">
          {renderContentEditor()}
        </TabsContent>
        
        <TabsContent value="en" className="space-y-6">
          {renderContentEditor()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversalContentEditor;