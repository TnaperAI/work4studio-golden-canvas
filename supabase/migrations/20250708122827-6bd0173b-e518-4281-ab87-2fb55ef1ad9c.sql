-- Create table for SEO settings for each page
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE, -- e.g., 'home', 'about', 'contact'
  page_title TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  h1_tag TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Create policies for page_seo
CREATE POLICY "Anyone can view page SEO" 
ON public.page_seo 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert page SEO" 
ON public.page_seo 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update page SEO" 
ON public.page_seo 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete page SEO" 
ON public.page_seo 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO data for main pages
INSERT INTO public.page_seo (page_slug, page_title, h1_tag) VALUES 
('home', 'Главная страница', 'Добро пожаловать в Work4Studio'),
('services', 'Услуги', 'Наши услуги'),
('cases', 'Кейсы', 'Наши работы'),
('contact', 'Контакты', 'Связаться с нами');