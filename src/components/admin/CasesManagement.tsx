import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Eye,
  EyeOff,
  Calendar,
  ArrowUp,
  ArrowDown,
  Star,
  StarOff,
  ExternalLink
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Case {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  client_name: string;
  project_url: string;
  main_image: string;
  technologies: string[];
  category: string;
  project_date: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface CasesManagementProps {
  onCaseEdit: (caseId: string) => void;
  onCaseCreate: () => void;
}

const categoryNames: Record<string, string> = {
  website: 'Веб-сайт',
  ecommerce: 'Интернет-магазин',
  mobile: 'Мобильное приложение',
  landing: 'Лендинг',
  corporate: 'Корпоративный сайт',
  startup: 'Стартап',
  redesign: 'Редизайн'
};

const categoryColors: Record<string, string> = {
  website: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ecommerce: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  mobile: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  landing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  corporate: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  startup: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  redesign: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
};

const CasesManagement = ({ onCaseEdit, onCaseCreate }: CasesManagementProps) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const { toast } = useToast();

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching cases:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить кейсы',
        variant: 'destructive',
      });
    } else {
      setCases(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleToggleActive = async (caseItem: Case) => {
    const { error } = await supabase
      .from('cases')
      .update({ is_active: !caseItem.is_active })
      .eq('id', caseItem.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус кейса',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: `Кейс ${caseItem.is_active ? 'скрыт' : 'показан'}`,
      });
      fetchCases();
    }
  };

  const handleToggleFeatured = async (caseItem: Case) => {
    const { error } = await supabase
      .from('cases')
      .update({ is_featured: !caseItem.is_featured })
      .eq('id', caseItem.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус "Избранное"',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: `Кейс ${caseItem.is_featured ? 'убран из' : 'добавлен в'} избранное`,
      });
      fetchCases();
    }
  };

  const handleDelete = async () => {
    if (!caseToDelete) return;

    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseToDelete.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить кейс',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Кейс удален',
      });
      fetchCases();
    }
    setDeleteDialogOpen(false);
    setCaseToDelete(null);
  };

  const handleSort = async (caseItem: Case, direction: 'up' | 'down') => {
    const currentIndex = cases.findIndex(c => c.id === caseItem.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= cases.length) return;

    const targetCase = cases[targetIndex];
    
    // Swap sort orders
    const { error } = await supabase
      .from('cases')
      .update({ sort_order: targetCase.sort_order })
      .eq('id', caseItem.id);

    if (!error) {
      await supabase
        .from('cases')
        .update({ sort_order: caseItem.sort_order })
        .eq('id', targetCase.id);
    }

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить порядок',
        variant: 'destructive',
      });
    } else {
      fetchCases();
    }
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
        <div>
          <h1 className="text-3xl font-heading font-bold">Управление кейсами</h1>
          <p className="text-muted-foreground">
            Добавляйте, редактируйте и управляйте портфолио
          </p>
        </div>
        <Button onClick={onCaseCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить кейс
        </Button>
      </div>

      <div className="space-y-4">
        {cases.map((caseItem, index) => (
          <Card key={caseItem.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {caseItem.main_image ? (
                      <img 
                        src={caseItem.main_image} 
                        alt={caseItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Без фото</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{caseItem.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={caseItem.is_active ? 'default' : 'secondary'}>
                          {caseItem.is_active ? 'Активен' : 'Скрыт'}
                        </Badge>
                        <Badge variant={caseItem.is_featured ? 'default' : 'outline'}>
                          {caseItem.is_featured ? 'На главной' : 'Скрыт с главной'}
                        </Badge>
                        {caseItem.is_featured && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Избранное
                          </Badge>
                        )}
                        <Badge className={categoryColors[caseItem.category] || 'bg-gray-100 text-gray-800'}>
                          {categoryNames[caseItem.category] || caseItem.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Slug: /cases/{caseItem.slug}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(caseItem.project_date).toLocaleDateString('ru-RU')}
                      </div>
                      <div>
                        Клиент: {caseItem.client_name}
                      </div>
                      <div>
                        {caseItem.technologies.length} технологий
                      </div>
                      {caseItem.project_url && (
                        <a 
                          href={caseItem.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ссылка
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Sort buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(caseItem, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(caseItem, 'down')}
                      disabled={index === cases.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Action buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(caseItem)}
                  >
                    {caseItem.is_featured ? (
                      <StarOff className="h-4 w-4" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(caseItem)}
                  >
                    {caseItem.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCaseEdit(caseItem.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCaseToDelete(caseItem);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {caseItem.short_description}
              </p>
              
              {/* Control switches */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={caseItem.is_active}
                    onCheckedChange={async (checked) => {
                      const { error } = await supabase
                        .from('cases')
                        .update({ is_active: checked })
                        .eq('id', caseItem.id);
                      
                      if (!error) {
                        fetchCases();
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">Активен</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={caseItem.is_featured}
                    onCheckedChange={async (checked) => {
                      const { error } = await supabase
                        .from('cases')
                        .update({ is_featured: checked })
                        .eq('id', caseItem.id);
                      
                      if (!error) {
                        fetchCases();
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">Показать на главной</span>
                </div>
              </div>
              
              {caseItem.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {caseItem.technologies.slice(0, 6).map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {caseItem.technologies.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{caseItem.technologies.length - 6} еще
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {cases.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">Кейсы не найдены</p>
            <Button onClick={onCaseCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый кейс
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить кейс</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить кейс "{caseToDelete?.title}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CasesManagement;