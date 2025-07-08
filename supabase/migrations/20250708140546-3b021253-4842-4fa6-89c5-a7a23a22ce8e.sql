-- Create services table for managing website services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price_from INTEGER,
  price_to INTEGER,
  features TEXT[],
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
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for services
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all services" 
ON public.services 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create services" 
ON public.services 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update services" 
ON public.services 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete services" 
ON public.services 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (title, slug, description, short_description, price_from, price_to, features, sort_order, h1_tag) VALUES 
(
  'Корпоративный сайт',
  'corporate',
  'Профессиональный корпоративный сайт для представления вашей компании в интернете. Включает все необходимые разделы: о компании, услуги, портфолио, контакты.',
  'Профессиональная разработка корпоративного сайта',
  150000,
  500000,
  ARRAY['Адаптивный дизайн', 'SEO-оптимизация', 'Система управления контентом', 'Интеграция с CRM', 'Аналитика'],
  1,
  'Корпоративный сайт - Профессиональная разработка'
),
(
  'Интернет-магазин',
  'ecommerce',
  'Полнофункциональный интернет-магазин с каталогом товаров, корзиной, системой заказов и платежей.',
  'Каталог с корзиной и системой заказов',
  300000,
  1000000,
  ARRAY['Каталог товаров', 'Корзина покупок', 'Система платежей', 'Личный кабинет', 'Управление заказами', 'Интеграция с 1С'],
  2,
  'Интернет-магазин - Каталог с корзиной'
),
(
  'Лендинг',
  'lending',
  'Одностраничный сайт для продажи конкретного товара или услуги. Максимально конверсионный дизайн.',
  'Одностраничный продающий сайт',
  50000,
  200000,
  ARRAY['Продающий дизайн', 'Call-to-Action элементы', 'Форма заказа', 'Счетчики конверсий'],
  3,
  'Лендинг - Продающая страница'
),
(
  'Сайт под франшизу',
  'franchise',
  'Готовое решение для франшизы с возможностью создания сайтов для франчайзи.',
  'Готовое решение для франшизы',
  200000,
  600000,
  ARRAY['Мультисайтовость', 'Единая админ панель', 'Брендинг франшизы', 'Локальная адаптация'],
  4,
  'Сайт под франшизу'
),
(
  'MVP / Startup-сайт',
  'mvp',
  'Быстрое создание MVP для стартапа. Минимально жизнеспособный продукт для тестирования идеи.',
  'Быстрый запуск MVP для стартапа',
  100000,
  400000,
  ARRAY['Быстрая разработка', 'Базовый функционал', 'Аналитика поведения', 'A/B тестирование'],
  5,
  'MVP / Startup-сайт'
);