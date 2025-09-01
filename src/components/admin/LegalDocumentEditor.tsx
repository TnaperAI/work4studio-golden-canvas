import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface LegalDocument {
  id?: string;
  type: string;
  title: string;
  content: string;
  last_updated?: string;
}

interface LegalDocumentTranslation {
  title: string;
  content: string;
}

interface LegalDocumentEditorProps {
  documentId?: string;
  documentType?: string;
  onBack: () => void;
}

const LegalDocumentEditor = ({ documentId, documentType, onBack }: LegalDocumentEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!documentId);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');

  const [formData, setFormData] = useState<LegalDocument>({
    type: documentType || 'privacy',
    title: '',
    content: ''
  });

  const [enData, setEnData] = useState<LegalDocumentTranslation>({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (documentId) {
      fetchDocument();
    } else {
      setLoading(false);
    }
  }, [documentId]);

  const fetchDocument = async () => {
    if (!documentId) return;

    try {
      // Fetch base document
      const { data: document, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('id', documentId)
        .maybeSingle();

      if (error) throw error;

      if (document) {
        setFormData(document);

        // Fetch EN translation
        const { data: translation, error: trError } = await supabase
          .from('legal_document_translations')
          .select('title, content')
          .eq('document_id', document.id)
          .eq('language', 'en')
          .maybeSingle();

        if (!trError && translation) {
          setEnData({
            title: translation.title || '',
            content: translation.content || ''
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching document:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить документ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      let savedId = documentId;

      if (documentId) {
        // Update existing document
        const { error: updateError } = await supabase
          .from('legal_documents')
          .update({
            title: formData.title,
            content: formData.content,
            type: formData.type,
            last_updated: new Date().toISOString()
          })
          .eq('id', documentId);

        if (updateError) throw updateError;
      } else {
        // Create new document
        const { data: inserted, error: insertError } = await supabase
          .from('legal_documents')
          .insert([{
            type: formData.type,
            title: formData.title,
            content: formData.content
          }])
          .select('id')
          .single();

        if (insertError) throw insertError;
        savedId = inserted.id;
      }

      // Save EN translation if provided
      const hasEnTranslation = enData.title.trim() || enData.content.trim();
      
      if (hasEnTranslation && savedId) {
        const { error: translationError } = await supabase
          .from('legal_document_translations')
          .upsert({
            document_id: savedId,
            language: 'en',
            title: enData.title || '',
            content: enData.content || ''
          });

        if (translationError) {
          console.error('Error saving translation:', translationError);
          throw translationError;
        }
      }

      toast({
        title: 'Успешно',
        description: documentId ? 'Документ обновлен' : 'Документ создан',
      });
      
      onBack();
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить документ',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof LegalDocument, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEnField = (field: keyof LegalDocumentTranslation, value: string) => {
    setEnData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к документам
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">
              {documentId ? 'Редактирование документа' : 'Создание документа'}
            </h1>
            <p className="text-muted-foreground">
              {documentId ? `Редактирование: ${formData.title}` : 'Добавление нового юридического документа'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="ru">RU (Русский)</TabsTrigger>
          <TabsTrigger value="en">EN (English)</TabsTrigger>
        </TabsList>

        <TabsContent value="ru" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Документ на русском языке</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Тип документа</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  placeholder="privacy, terms, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Заголовок *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Политика конфиденциальности"
                />
              </div>

              <div className="space-y-2">
                <Label>Содержание *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  placeholder="Полный текст документа..."
                  rows={20}
                  className="min-h-[500px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>English Translation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  placeholder="privacy, terms, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={enData.title}
                  onChange={(e) => updateEnField('title', e.target.value)}
                  placeholder="Privacy Policy"
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={enData.content}
                  onChange={(e) => updateEnField('content', e.target.value)}
                  placeholder="Full document text in English..."
                  rows={20}
                  className="min-h-[500px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalDocumentEditor;