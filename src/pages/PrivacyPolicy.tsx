import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';

interface LegalDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  last_updated: string;
}

const PrivacyPolicy = () => {
  const { type } = useParams();
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [type]);

  const fetchDocument = async () => {
    try {
      const documentType = type || 'privacy_policy';
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('type', documentType)
        .single();

      if (error) throw error;
      setDocument(data);
    } catch (error) {
      console.error('Error fetching legal document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Документ не найден</h1>
          <p className="text-muted-foreground">Запрашиваемый документ не существует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading font-bold">{document.title}</h1>
            <p className="text-muted-foreground">
              Последнее обновление: {new Date(document.last_updated).toLocaleDateString('ru')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: document.content.replace(/\n/g, '<br />') }}
            />
          </div>

          <div className="border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Work4Studio. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;