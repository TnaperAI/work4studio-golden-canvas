import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface LegalDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

const LegalDocumentsManagement = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [editingDocument, setEditingDocument] = useState<LegalDocument | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<{ title: string; content: string } | null>(null);
  const [translations, setTranslations] = useState<Record<string, { title: string; content: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: '',
    title: '',
    content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('type');

      if (error) throw error;
      setDocuments(data || []);

      const { data: tr } = await supabase
        .from('legal_document_translations')
        .select('document_id, title, content')
        .eq('language', 'en');

      const map: Record<string, { title: string; content: string }> = {};
      (tr || []).forEach((row: any) => {
        map[row.document_id] = { title: row.title, content: row.content };
      });
      setTranslations(map);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить документы: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingDocument) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('legal_documents')
        .update({
          title: editingDocument.title,
          content: editingDocument.content,
          last_updated: new Date().toISOString(),
        })
        .eq('id', editingDocument.id);

      if (error) throw error;

      // Save EN translation
      if (editingTranslation) {
        const { data: existing } = await supabase
          .from('legal_document_translations')
          .select('id')
          .eq('document_id', editingDocument.id)
          .eq('language', 'en')
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase
            .from('legal_document_translations')
            .update({
              title: editingTranslation.title,
              content: editingTranslation.content,
            })
            .eq('document_id', editingDocument.id)
            .eq('language', 'en');
        } else {
          await supabase
            .from('legal_document_translations')
            .insert([{
              document_id: editingDocument.id,
              language: 'en',
              title: editingTranslation.title,
              content: editingTranslation.content,
            }]);
        }
      }

      toast({
        title: 'Успешно',
        description: 'Документ обновлен',
      });

      await fetchDocuments();
      setEditingDocument(null);
      setEditingTranslation(null);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить документ: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDocument = async () => {
    if (!newDocument.type || !newDocument.title || !newDocument.content) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('legal_documents')
        .insert([{
          type: newDocument.type,
          title: newDocument.title,
          content: newDocument.content,
        }]);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Документ добавлен',
      });

      await fetchDocuments();
      setShowAddForm(false);
      setNewDocument({ type: '', title: '', content: '' });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить документ: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('legal_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Документ удален',
      });

      await fetchDocuments();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить документ: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'privacy_policy': 'Политика конфиденциальности',
      'terms_of_service': 'Пользовательское соглашение',
      'cookie_policy': 'Политика cookies',
      'data_processing': 'Согласие на обработку данных',
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Правовые документы
          </h1>
          <p className="text-muted-foreground">
            Управление политикой конфиденциальности и другими правовыми документами
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить документ
        </Button>
      </div>

      {/* Add Document Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Добавить новый документ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="new-type">Тип документа</Label>
              <Input
                id="new-type"
                value={newDocument.type}
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                placeholder="privacy_policy, terms_of_service, cookie_policy..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-title">Заголовок</Label>
              <Input
                id="new-title"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Политика конфиденциальности"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-content">Содержимое</Label>
              <Textarea
                id="new-content"
                value={newDocument.content}
                onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Текст документа..."
                className="min-h-[200px]"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddDocument} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents List */}
      <div className="grid gap-6">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {editingDocument?.id === document.id ? (
                      <Input
                        value={editingDocument.title}
                        onChange={(e) => setEditingDocument(prev => 
                          prev ? { ...prev, title: e.target.value } : null
                        )}
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <>
                        {document.title}
                        <Badge variant="secondary">{getDocumentTypeLabel(document.type)}</Badge>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Последнее обновление: {new Date(document.last_updated).toLocaleString('ru')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {editingDocument?.id === document.id ? (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => { setEditingDocument(null); setEditingTranslation(null); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingDocument(document);
                          setEditingTranslation(translations[document.id] ?? { title: '', content: '' });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить документ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Документ "{document.title}" будет удален навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(document.id)}>
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
                  <div className="grid gap-2">
                    <Label htmlFor={`ru-title-${document.id}`}>Заголовок (RU)</Label>
                    <Input
                      id={`ru-title-${document.id}`}
                      value={editingDocument?.title ?? ''}
                      onChange={(e) => setEditingDocument(prev => 
                        prev ? { ...prev, title: e.target.value } : null
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`ru-content-${document.id}`}>Содержимое (RU)</Label>
                    <Textarea
                      id={`ru-content-${document.id}`}
                      value={editingDocument.content}
                      onChange={(e) => setEditingDocument(prev => 
                        prev ? { ...prev, content: e.target.value } : null
                      )}
                      className="min-h-[300px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`en-title-${document.id}`}>Заголовок (EN)</Label>
                    <Input
                      id={`en-title-${document.id}`}
                      value={editingTranslation?.title ?? ''}
                      onChange={(e) => setEditingTranslation(prev => ({ ...(prev || { title: '', content: '' }), title: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`en-content-${document.id}`}>Содержимое (EN)</Label>
                    <Textarea
                      id={`en-content-${document.id}`}
                      value={editingTranslation?.content ?? ''}
                      onChange={(e) => setEditingTranslation(prev => ({ ...(prev || { title: '', content: '' }), content: e.target.value }))}
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg max-h-[300px] overflow-y-auto">
                    {document.content}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Документы не найдены</p>
        </div>
      )}
    </div>
  );
};

export default LegalDocumentsManagement;