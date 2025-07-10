import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutGrid,
  List,
  RefreshCw,
  Download,
  Trash2,
  Calendar as CalendarIcon,
  MessageCircle,
  AlertCircle
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import ContactSubmissionCard from './ContactSubmissionCard';
import ContactSubmissionFilters from './ContactSubmissionFilters';
import ContactSubmissionKanban from './ContactSubmissionKanban';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ContactSubmissionsManagement = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    hasPhone: ''
  });
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    console.log('Fetching contact submissions...');
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive',
      });
    } else {
      console.log('Contact submissions fetched successfully:', data);
      setSubmissions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (submissionId: string, newStatus: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: newStatus })
      .eq('id', submissionId);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Статус заявки обновлен',
      });
      fetchSubmissions();
    }
  };

  const editSubmission = async (submission: ContactSubmission) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message
      })
      .eq('id', submission.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить заявку',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Заявка обновлена',
      });
      fetchSubmissions();
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', submissionId);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Заявка удалена',
      });
      fetchSubmissions();
    }
  };

  const exportToCSV = () => {
    const headers = ['Имя', 'Email', 'Телефон', 'Сообщение', 'Статус', 'Дата создания'];
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(submission => [
        submission.name,
        submission.email,
        submission.phone || '',
        `"${submission.message.replace(/"/g, '""')}"`,
        submission.status,
        new Date(submission.created_at).toLocaleDateString('ru-RU')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `заявки_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const matchesSearch = !filters.search || 
        submission.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        submission.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        (submission.phone && submission.phone.includes(filters.search)) ||
        submission.message.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || submission.status === filters.status;
      
      const matchesPhone = !filters.hasPhone || 
        (filters.hasPhone === 'yes' && submission.phone) ||
        (filters.hasPhone === 'no' && !submission.phone);
      
      const matchesDateFrom = !filters.dateFrom || 
        new Date(submission.created_at) >= filters.dateFrom;
      
      const matchesDateTo = !filters.dateTo || 
        new Date(submission.created_at) <= filters.dateTo;
      
      return matchesSearch && matchesStatus && matchesPhone && matchesDateFrom && matchesDateTo;
    });
  }, [submissions, filters]);

  const submissionCounts = useMemo(() => ({
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    in_progress: submissions.filter(s => s.status === 'in_progress').length,
    completed: submissions.filter(s => s.status === 'completed').length,
    cancelled: submissions.filter(s => s.status === 'cancelled').length,
  }), [submissions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Заявки с сайта</h1>
          <p className="text-muted-foreground">
            Управление заявками от клиентов ({filteredSubmissions.length} из {submissions.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Экспорт CSV
          </Button>
          <Button onClick={fetchSubmissions} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ContactSubmissionFilters
        filters={filters}
        onFiltersChange={setFilters}
        submissionCounts={submissionCounts}
      />

      {/* View Mode Switcher */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4 mr-2" />
          Список
        </Button>
        <Button
          variant={viewMode === 'kanban' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('kanban')}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Канбан
        </Button>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <ContactSubmissionKanban
          submissions={filteredSubmissions}
          onStatusUpdate={updateStatus}
          onEdit={editSubmission}
          onDelete={deleteSubmission}
        />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <ContactSubmissionCard
              key={submission.id}
              submission={submission}
              onStatusUpdate={updateStatus}
              onEdit={editSubmission}
              onDelete={deleteSubmission}
              viewMode="card"
            />
          ))}
          
          {filteredSubmissions.length === 0 && submissions.length > 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Заявки не найдены по заданным фильтрам</p>
                <Button variant="outline" onClick={() => setFilters({
                  search: '',
                  status: '',
                  dateFrom: undefined,
                  dateTo: undefined,
                  hasPhone: ''
                })}>
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          )}
          
          {submissions.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Заявки не найдены</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionsManagement;