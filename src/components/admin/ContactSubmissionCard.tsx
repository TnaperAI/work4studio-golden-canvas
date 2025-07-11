import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  User,
  MoreHorizontal
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

interface ContactSubmissionCardProps {
  submission: ContactSubmission;
  onStatusUpdate: (submissionId: string, newStatus: string) => void;
  onEdit: (submission: ContactSubmission) => void;
  onDelete: (submissionId: string) => void;
  viewMode?: 'card' | 'kanban';
}

const ContactSubmissionCard = ({ 
  submission, 
  onStatusUpdate, 
  onEdit, 
  onDelete,
  viewMode = 'card'
}: ContactSubmissionCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: submission.name,
    email: submission.email,
    phone: submission.phone || '',
    message: submission.message
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'homepage_form':
        return 'Форма на главной';
      case 'homepage_cta':
        return 'CTA на главной';
      case 'hero_section':
        return 'Hero секция';
      case 'header':
        return 'Шапка сайта';
      case 'contact_page':
        return 'Страница контактов';
      case 'services_page':
        return 'Страница услуг';
      case 'service_detail_page':
        return 'Детали услуги';
      case 'modal':
        return 'Модальное окно';
      default:
        return source || 'Неизвестно';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новая';
      case 'in_progress':
        return 'В работе';
      case 'completed':
        return 'Завершена';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
    }
  };

  const handleEdit = () => {
    onEdit({
      ...submission,
      ...editData
    });
    setEditDialogOpen(false);
  };

  const cardClassName = viewMode === 'kanban' 
    ? "cursor-pointer hover:shadow-md transition-shadow mb-3" 
    : "relative";

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">{submission.name}</CardTitle>
                <Badge className={getStatusColor(submission.status)} variant="secondary">
                  {getStatusLabel(submission.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {submission.email}
                </div>
                {submission.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {submission.phone}
                  </div>
                )}
                {submission.source && (
                  <Badge variant="outline" className="text-xs">
                    {getSourceLabel(submission.source)}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(submission.created_at).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="h-4 w-4 mr-2" />
                    Просмотр
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Детали заявки</DialogTitle>
                    <DialogDescription>
                      Заявка от {submission.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Имя</label>
                        <p className="text-sm">{submission.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-sm">{submission.email}</p>
                      </div>
                      {submission.phone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Телефон</label>
                          <p className="text-sm">{submission.phone}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Дата</label>
                        <p className="text-sm">
                          {new Date(submission.created_at).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {submission.source && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Источник</label>
                          <p className="text-sm">{getSourceLabel(submission.source)}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Сообщение</label>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Редактировать заявку</DialogTitle>
                    <DialogDescription>
                      Изменение данных заявки от {submission.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="edit-name">Имя</Label>
                        <Input
                          id="edit-name"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="edit-phone">Телефон</Label>
                        <Input
                          id="edit-phone"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-message">Сообщение</Label>
                      <Textarea
                        id="edit-message"
                        rows={6}
                        value={editData.message}
                        onChange={(e) => setEditData({...editData, message: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleEdit}>
                        Сохранить
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(submission.id, 'in_progress')}
                disabled={submission.status === 'in_progress'}
              >
                В работу
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(submission.id, 'completed')}
                disabled={submission.status === 'completed'}
              >
                Завершить
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusUpdate(submission.id, 'cancelled')}
                disabled={submission.status === 'cancelled'}
              >
                Отменить
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDelete(submission.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      {viewMode === 'card' && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {submission.message}
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={() => onStatusUpdate(submission.id, 'in_progress')}
              variant="outline"
              size="sm"
              disabled={submission.status === 'in_progress'}
            >
              В работу
            </Button>
            <Button 
              onClick={() => onStatusUpdate(submission.id, 'completed')}
              variant="outline"
              size="sm"
              disabled={submission.status === 'completed'}
            >
              Завершить
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ContactSubmissionCard;