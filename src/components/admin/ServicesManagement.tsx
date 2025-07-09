import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
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

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number;
  price_to: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ServicesManagementProps {
  onServiceEdit: (serviceId: string) => void;
  onServiceCreate: () => void;
}

const ServicesManagement = ({ onServiceEdit, onServiceCreate }: ServicesManagementProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const { toast } = useToast();

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить услуги',
        variant: 'destructive',
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус услуги',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: `Услуга ${service.is_active ? 'скрыта' : 'показана'}`,
      });
      fetchServices();
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceToDelete.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить услугу',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Услуга удалена',
      });
      fetchServices();
    }
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleSort = async (service: Service, direction: 'up' | 'down') => {
    const currentIndex = services.findIndex(s => s.id === service.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const targetService = services[targetIndex];
    
    // Swap sort orders
    const { error } = await supabase
      .from('services')
      .update({ sort_order: targetService.sort_order })
      .eq('id', service.id);

    if (!error) {
      await supabase
        .from('services')
        .update({ sort_order: service.sort_order })
        .eq('id', targetService.id);
    }

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить порядок',
        variant: 'destructive',
      });
    } else {
      fetchServices();
    }
  };

  const formatPrice = (from: number, to: number) => {
    return `${from.toLocaleString()} - ${to.toLocaleString()} ₽`;
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
          <h1 className="text-3xl font-heading font-bold">Управление услугами</h1>
          <p className="text-muted-foreground">
            Добавляйте, редактируйте и удаляйте услуги сайта
          </p>
        </div>
        <Button onClick={onServiceCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить услугу
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <Card key={service.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Активна' : 'Скрыта'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Slug: /services/{service.slug}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>
                      {formatPrice(service.price_from, service.price_to)}
                    </div>
                    <div>
                      {service.features.length} особенностей
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Sort buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(service, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(service, 'down')}
                      disabled={index === services.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Action buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onServiceEdit(service.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setServiceToDelete(service);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.short_description}
              </p>
              {service.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {service.features.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.features.length - 4} еще
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">Услуги не найдены</p>
            <Button onClick={onServiceCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первую услугу
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить услугу</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить услугу "{serviceToDelete?.title}"? 
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

export default ServicesManagement;