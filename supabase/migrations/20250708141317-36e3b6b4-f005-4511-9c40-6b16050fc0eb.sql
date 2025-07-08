-- Create enum for case categories first
CREATE TYPE case_category AS ENUM (
  'website',
  'ecommerce', 
  'mobile',
  'landing',
  'corporate',
  'startup',
  'redesign'
);

-- Create cases table for portfolio management
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  client_name TEXT,
  project_url TEXT,
  main_image TEXT,
  gallery_images TEXT[],
  technologies TEXT[],
  category case_category NOT NULL DEFAULT 'website',
  project_date DATE,
  project_duration TEXT,
  budget_range TEXT,
  results TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
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

-- Enable RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Create policies for cases
CREATE POLICY "Anyone can view active cases" 
ON public.cases 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all cases" 
ON public.cases 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create cases" 
ON public.cases 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update cases" 
ON public.cases 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete cases" 
ON public.cases 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample cases with placeholder images
INSERT INTO public.cases (
  title, slug, short_description, description, client_name, project_url,
  main_image, gallery_images, technologies, category, project_date,
  project_duration, budget_range, results, is_featured, sort_order, h1_tag
) VALUES 
(
  'Корпоративный сайт для IT-компании',
  'corporate-it-website',
  'Современный корпоративный сайт с интерактивными элементами',
  'Разработали полнофункциональный корпоративный сайт для IT-компании с акцентом на современный дизайн и удобную навигацию. Сайт включает в себя презентацию услуг, портфолио и удобную форму обратной связи.',
  'TechSolutions Ltd',
  'https://example.com',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop'
  ],
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  'corporate',
  '2024-01-15',
  '2 месяца',
  '300 000 - 500 000 ₽',
  ARRAY['Увеличение конверсии на 45%', 'Рост органического трафика на 60%', 'Снижение отказов на 30%'],
  true,
  1,
  'Корпоративный сайт для IT-компании - Кейс Work4Studio'
),
(
  'Интернет-магазин модной одежды',
  'fashion-ecommerce',
  'Стильный интернет-магазин с удобным каталогом',
  'Создали современный интернет-магазин одежды с интуитивной навигацией, удобным каталогом товаров и интегрированной системой платежей. Особое внимание уделили мобильной версии и скорости загрузки.',
  'Fashion Week',
  'https://example.com',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop'
  ],
  ARRAY['Next.js', 'Stripe', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
  'ecommerce',
  '2024-02-20',
  '3 месяца',
  '500 000 - 800 000 ₽',
  ARRAY['Средний чек увеличился на 25%', 'Конверсия в покупку 12%', 'Mobile traffic 65%'],
  true,
  2,
  'Интернет-магазин модной одежды - Кейс Work4Studio'
),
(
  'Стартап лендинг для финтех продукта',
  'fintech-startup-landing',
  'Конверсионный лендинг для финансового стартапа',
  'Разработали высококонверсионную посадочную страницу для финтех стартапа. Лендинг включает интерактивные элементы, анимации и четкие призывы к действию для максимизации конверсии.',
  'FinStart',
  'https://example.com',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop'
  ],
  ARRAY['React', 'Framer Motion', 'TypeScript', 'Vercel'],
  'landing',
  '2024-03-10',
  '1 месяц',
  '150 000 - 250 000 ₽',
  ARRAY['Конверсия в заявку 8.5%', 'Время на сайте +40%', 'Отказы снижены до 15%'],
  false,
  3,
  'Стартап лендинг для финтех продукта - Кейс Work4Studio'
);