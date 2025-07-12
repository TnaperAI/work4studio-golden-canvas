import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mail, Plus, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EmailTemplatesManagement = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    variables: '',
    is_active: true
  });

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить шаблоны писем',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async () => {
    try {
      const variables = formData.variables 
        ? formData.variables.split(',').map(v => v.trim()).filter(Boolean)
        : [];

      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: formData.name,
          subject: formData.subject,
          content: formData.content,
          variables: variables,
          is_active: formData.is_active
        });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Шаблон создан',
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать шаблон',
        variant: 'destructive',
      });
    }
  };

  const updateTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const variables = formData.variables 
        ? formData.variables.split(',').map(v => v.trim()).filter(Boolean)
        : [];

      const { error } = await supabase
        .from('email_templates')
        .update({
          name: formData.name,
          subject: formData.subject,
          content: formData.content,
          variables: variables,
          is_active: formData.is_active
        })
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Шаблон обновлен',
      });

      setIsEditDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить шаблон',
        variant: 'destructive',
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Шаблон удален',
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить шаблон',
        variant: 'destructive',
      });
    }
  };

  const duplicateTemplate = async (template: EmailTemplate) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: `${template.name} (копия)`,
          subject: template.subject,
          content: template.content,
          variables: template.variables,
          is_active: false
        });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Шаблон скопирован',
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать шаблон',
        variant: 'destructive',
      });
    }
  };

  const toggleTemplateActive = async (templateId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_active: isActive })
        .eq('id', templateId);

      if (error) throw error;

      fetchTemplates();
    } catch (error) {
      console.error('Error toggling template:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус шаблона',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      content: '',
      variables: '',
      is_active: true
    });
    setSelectedTemplate(null);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      variables: template.variables?.join(', ') || '',
      is_active: template.is_active
    });
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const renderTemplateVariables = (variables?: string[]) => {
    if (!variables || variables.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {variables.map((variable, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {'{'}${variable}{'}'}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Шаблоны писем</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать шаблон
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{templates.length}</div>
            <div className="text-sm text-muted-foreground">Всего шаблонов</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => t.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">Активных</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {templates.filter(t => !t.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">Неактивных</div>
          </CardContent>
        </Card>
      </div>

      {/* Список шаблонов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8">Загрузка...</div>
        ) : templates.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Шаблоны не найдены</p>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className={`${!template.is_active ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={(checked) => toggleTemplateActive(template.id, checked)}
                    />
                    <Badge variant={template.is_active ? 'default' : 'secondary'}>
                      {template.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Тема письма:</p>
                    <p className="text-sm">{template.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Содержание:</p>
                    <p className="text-sm line-clamp-3">{template.content}</p>
                  </div>

                  {renderTemplateVariables(template.variables)}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Создан: {format(new Date(template.created_at), 'dd.MM.yyyy', { locale: ru })}
                    </span>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{template.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Тема письма</label>
                              <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                                {template.subject}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Содержание</label>
                              <div className="text-sm text-muted-foreground p-2 bg-muted rounded whitespace-pre-wrap">
                                {template.content}
                              </div>
                            </div>
                            {template.variables && template.variables.length > 0 && (
                              <div>
                                <label className="text-sm font-medium">Переменные</label>
                                {renderTemplateVariables(template.variables)}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(template)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateTemplate(template)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Диалог создания шаблона */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать новый шаблон</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Название шаблона</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Название шаблона"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Тема письма</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Тема письма (можно использовать переменные: {company_name})"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Содержание письма</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Текст письма..."
                className="min-h-[200px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Переменные (через запятую)</label>
              <Input
                value={formData.variables}
                onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                placeholder="company_name, industry, city"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Переменные можно использовать в тексте как: {'{company_name}'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <span className="text-sm">Активен</span>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={createTemplate}>
                Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования шаблона */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать шаблон</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Название шаблона</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Название шаблона"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Тема письма</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Тема письма (можно использовать переменные: {company_name})"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Содержание письма</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Текст письма..."
                className="min-h-[200px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Переменные (через запятую)</label>
              <Input
                value={formData.variables}
                onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                placeholder="company_name, industry, city"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Переменные можно использовать в тексте как: {'{company_name}'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <span className="text-sm">Активен</span>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={updateTemplate}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplatesManagement;