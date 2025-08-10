import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface LegalDocument {
  id: string;
  title: string;
  type: string;
}

interface ConsentCheckboxProps {
  isAgreed: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const ConsentCheckbox = ({ isAgreed, onChange, className = "" }: ConsentCheckboxProps) => {
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([]);
  const { language } = useLanguage();
  useEffect(() => {
    const fetchLegalDocuments = async () => {
      const { data: base } = await supabase
        .from('legal_documents')
        .select('id, title, type')
        .in('type', ['privacy_policy', 'terms_of_service']);

      let merged = base || [];

      if (language === 'en' && merged.length > 0) {
        const ids = merged.map((d) => d.id);
        const { data: tr } = await (supabase as any)
          .from('legal_document_translations')
          .select('document_id, title')
          .eq('language', 'en')
          .in('document_id', ids);

        if (tr && tr.length) {
          const map: Record<string, any> = {};
          tr.forEach((row: any) => { map[row.document_id] = row; });
          merged = merged.map((d) => ({
            ...d,
            title: map[d.id]?.title ?? d.title,
          }));
        }
      }

      setLegalDocuments(merged);
    };

    fetchLegalDocuments();
  }, [language]);

  const privacyDoc = legalDocuments.find(doc => doc.type === 'privacy_policy');
  const termsDoc = legalDocuments.find(doc => doc.type === 'terms_of_service');

  return (
    <div className={`flex items-start space-x-3 p-4 bg-secondary/30 rounded-xl border border-border ${className}`}>
      <input
        type="checkbox"
        id="agreement"
        checked={isAgreed}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
        required
      />
      <label htmlFor="agreement" className="text-sm text-muted-foreground leading-relaxed">
        {language === 'en' ? (
          <>
            I agree to the{' '}
            <a 
              href="/legal/terms_of_service" 
              target="_blank"
              className="text-primary hover:underline"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a 
              href="/legal/privacy_policy" 
              target="_blank"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </a>{' '}
            and consent to the processing of my personal data.
          </>
        ) : (
          <>
            Я соглашаюсь с условиями{' '}
            <a 
              href="/legal/terms_of_service" 
              target="_blank"
              className="text-primary hover:underline"
            >
              {termsDoc?.title || 'Публичной оферты'}
            </a>{' '}
            и{' '}
            <a 
              href="/legal/privacy_policy" 
              target="_blank"
              className="text-primary hover:underline"
            >
              {privacyDoc?.title || 'Политики конфиденциальности'}
            </a>{' '}
            и даю согласие на обработку моих персональных данных.
          </>
        )}
      </label>
    </div>
  );
};

export default ConsentCheckbox;