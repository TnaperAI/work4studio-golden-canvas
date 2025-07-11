-- Create table for legal documents (privacy policy, terms of service, etc.)
CREATE TABLE public.legal_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL UNIQUE, -- 'privacy_policy', 'terms_of_service', 'cookie_policy', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view legal documents" 
ON public.legal_documents 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert legal documents" 
ON public.legal_documents 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update legal documents" 
ON public.legal_documents 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete legal documents" 
ON public.legal_documents 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_legal_documents_updated_at
BEFORE UPDATE ON public.legal_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default privacy policy
INSERT INTO public.legal_documents (type, title, content) VALUES
('privacy_policy', 'Политика конфиденциальности', 'Здесь будет размещена политика конфиденциальности. Данный документ регулирует обработку персональных данных пользователей нашего сайта.');

-- Insert default terms of service
INSERT INTO public.legal_documents (type, title, content) VALUES
('terms_of_service', 'Пользовательское соглашение', 'Здесь будет размещено пользовательское соглашение. Данный документ определяет условия использования нашего сайта.');