import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ContactSubmissionCard from './ContactSubmissionCard';

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

interface ContactSubmissionKanbanProps {
  submissions: ContactSubmission[];
  onStatusUpdate: (submissionId: string, newStatus: string) => void;
  onEdit: (submission: ContactSubmission) => void;
  onDelete: (submissionId: string) => void;
}

const ContactSubmissionKanban = ({ 
  submissions, 
  onStatusUpdate, 
  onEdit, 
  onDelete 
}: ContactSubmissionKanbanProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const columns = [
    { 
      id: 'new', 
      title: 'Новые заявки', 
      color: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
      headerColor: 'text-blue-700 dark:text-blue-300'
    },
    { 
      id: 'in_progress', 
      title: 'В работе', 
      color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
      headerColor: 'text-yellow-700 dark:text-yellow-300'
    },
    { 
      id: 'completed', 
      title: 'Завершены', 
      color: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
      headerColor: 'text-green-700 dark:text-green-300'
    },
    { 
      id: 'cancelled', 
      title: 'Отменены', 
      color: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
      headerColor: 'text-red-700 dark:text-red-300'
    }
  ];

  const getSubmissionsByStatus = (status: string) => {
    return submissions.filter(submission => submission.status === status);
  };

  const handleDragStart = (e: React.DragEvent, submissionId: string) => {
    setDraggedItem(submissionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedItem) {
      const submission = submissions.find(s => s.id === draggedItem);
      if (submission && submission.status !== newStatus) {
        onStatusUpdate(draggedItem, newStatus);
      }
      setDraggedItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
      {columns.map(column => {
        const columnSubmissions = getSubmissionsByStatus(column.id);
        
        return (
          <Card 
            key={column.id} 
            className={`${column.color} flex flex-col h-full`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className={`text-lg ${column.headerColor} flex items-center justify-between`}>
                {column.title}
                <Badge variant="secondary" className="ml-2">
                  {columnSubmissions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto space-y-3 pb-3">
              {columnSubmissions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Заявок нет</p>
                </div>
              ) : (
                columnSubmissions.map(submission => (
                  <div
                    key={submission.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, submission.id)}
                    onDragEnd={handleDragEnd}
                    className={`${draggedItem === submission.id ? 'opacity-50' : ''} transition-opacity`}
                  >
                    <ContactSubmissionCard
                      submission={submission}
                      onStatusUpdate={onStatusUpdate}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      viewMode="kanban"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ContactSubmissionKanban;