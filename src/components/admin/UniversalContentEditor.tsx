import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ServiceEditor from './ServiceEditor';
import CaseEditor from './CaseEditor';
import LegalDocumentEditor from './LegalDocumentEditor';
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
    switch (type) {
      case 'page':
        return (
          <PageContentEditor 
            slug={slug!} 
            language={activeTab}
            onContentChange={(hasContent: boolean) => {
              if (activeTab === 'ru') {
                setHasRussianContent(hasContent);
              } else {
                setHasEnglishContent(hasContent);
              }
            }}
            onTitleChange={setTitle}
          />
        );
      case 'service':
        return (
          <ServiceEditor
            serviceId={id}
            onBack={onBack}
          />
        );
      case 'case':
        return (
          <CaseEditor
            caseId={id}
            onBack={onBack}
          />
        );
      case 'legal':
        return (
          <LegalDocumentEditor
            documentId={id}
            documentType={slug}
            onBack={onBack}
          />
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

      {/* Content Editor - let individual editors handle their own tabs */}
      <div className="space-y-6">
        {renderContentEditor()}
      </div>
    </div>
  );
};

export default UniversalContentEditor;