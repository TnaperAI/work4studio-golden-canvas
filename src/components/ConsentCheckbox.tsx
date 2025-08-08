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
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchLegalDocuments = async () => {
      const { data } = await supabase
        .from('legal_documents')
        .select('id, title, type')
        .in('type', ['privacy_policy', 'terms_of_service']);

      if (data) {
        setLegalDocuments(data);
      }
    };

    fetchLegalDocuments();
  }, []);

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
        {currentLanguage === 'en' ? 'I agree to the terms of the ' : 'Я соглашаюсь с условиями '}{' '}
        <a 
          href="/legal/terms_of_service" 
          target="_blank"
          className="text-primary hover:underline"
        >
          {termsDoc?.title || (currentLanguage === 'en' ? 'Terms of Service' : 'Публичной оферты')}
        </a>{' '}
        {currentLanguage === 'en' ? ' and ' : ' и '}{' '}
        <a 
          href="/legal/privacy_policy" 
          target="_blank"
          className="text-primary hover:underline"
        >
          {privacyDoc?.title || (currentLanguage === 'en' ? 'Privacy Policy' : 'Политики конфиденциальности')}
        </a>{' '}
        {currentLanguage === 'en' 
          ? ' and give consent to the processing of my personal data.'
          : ' и даю согласие на обработку моих персональных данных.'
        }
      </label>
    </div>
  );
};

export default ConsentCheckbox;