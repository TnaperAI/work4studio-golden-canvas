import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const [translation, setTranslation] = useState<{ title: string; content: string } | null>(null);
  const { language } = useLanguage();
  useEffect(() => {
    fetchDocument();
  }, [type, language]);

  const fetchDocument = async () => {
    try {
      setIsLoading(true);
      setTranslation(null);
      const documentType = type || 'privacy_policy';
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('type', documentType)
        .single();

      if (error) throw error;
      setDocument(data);

      if (language === 'en') {
        const { data: tr } = await (supabase as any)
          .from('legal_document_translations')
          .select('title, content')
          .eq('document_id', data.id)
          .eq('language', 'en')
          .limit(1);

        if (tr && tr.length > 0) {
          setTranslation({ title: tr[0].title, content: tr[0].content });
        }
      }
    } catch (error) {
      console.error('Error fetching legal document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Документ не найден</h1>
            <p className="text-muted-foreground">Запрашиваемый документ не существует</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-background pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {translation?.title ?? document.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                Последнее обновление: {new Date(document.last_updated).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-card-foreground">
                <div 
                  className="whitespace-pre-wrap leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: (translation?.content ?? document.content).replace(/\n/g, '<br />') }}
                />
              </div>
            </div>

            <div className="border-t border-border pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Work4Studio. Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;