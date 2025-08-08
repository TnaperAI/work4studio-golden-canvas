-- Add language column to page_seo table
ALTER TABLE public.page_seo 
ADD COLUMN language text NOT NULL DEFAULT 'ru';

-- Update existing records to have Russian language
UPDATE public.page_seo 
SET language = 'ru' 
WHERE language IS NULL OR language = '';

-- Drop the old unique constraint on page_slug only
ALTER TABLE public.page_seo 
DROP CONSTRAINT IF EXISTS page_seo_page_slug_key;

-- Create new unique constraint that includes language
ALTER TABLE public.page_seo 
ADD CONSTRAINT page_seo_page_slug_language_unique 
UNIQUE (page_slug, language);

-- Insert default SEO data for main pages in Russian
INSERT INTO public.page_seo (page_slug, page_title, meta_title, meta_description, h1_tag, language) VALUES
('home', 'Главная страница', 'Создание сайтов в Work4Studio - веб-разработка для бизнеса', 'Профессиональная разработка сайтов и веб-приложений. Создаем современные решения для малого и среднего бизнеса. ✓ Быстро ✓ Качественно ✓ Недорого', 'Создаём сайты, которые приносят клиентов', 'ru'),
('services', 'Услуги', 'Услуги веб-разработки - полный цикл создания сайтов', 'Полный спектр услуг по созданию сайтов: разработка, дизайн, продвижение, поддержка. Современные технологии и индивидуальный подход к каждому проекту.', 'Наши услуги', 'ru'),
('cases', 'Кейсы', 'Портфолио Work4Studio - примеры наших работ', 'Посмотрите примеры наших успешных проектов. Кейсы разработки сайтов для различных сфер бизнеса с описанием решений и результатов.', 'Наши работы', 'ru'),
('about', 'О нас', 'О компании Work4Studio - команда веб-разработчиков', 'Узнайте больше о нашей команде разработчиков. Опыт, подход к работе, принципы и ценности студии веб-разработки Work4Studio.', 'О нашей компании', 'ru'),
('contact', 'Контакты', 'Контакты Work4Studio - связаться с нами', 'Свяжитесь с нами для обсуждения вашего проекта. Телефон, email, адрес офиса. Бесплатная консультация по веб-разработке.', 'Связаться с нами', 'ru')
ON CONFLICT (page_slug, language) DO UPDATE SET 
  page_title = EXCLUDED.page_title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  h1_tag = EXCLUDED.h1_tag;

-- Insert default SEO data for main pages in English
INSERT INTO public.page_seo (page_slug, page_title, meta_title, meta_description, h1_tag, language) VALUES
('home', 'Home Page', 'Website Development at Work4Studio - Web Development for Business', 'Professional website and web application development. We create modern solutions for small and medium businesses. ✓ Fast ✓ Quality ✓ Affordable', 'Creating websites that bring clients', 'en'),
('services', 'Services', 'Web Development Services - Full Cycle Website Creation', 'Full range of website creation services: development, design, promotion, support. Modern technologies and individual approach to each project.', 'Our Services', 'en'),
('cases', 'Cases', 'Work4Studio Portfolio - Examples of Our Work', 'See examples of our successful projects. Website development cases for various business sectors with solution descriptions and results.', 'Our Work', 'en'),
('about', 'About Us', 'About Work4Studio Company - Web Development Team', 'Learn more about our development team. Experience, work approach, principles and values of Work4Studio web development studio.', 'About Our Company', 'en'),
('contact', 'Contact', 'Work4Studio Contacts - Get in Touch', 'Contact us to discuss your project. Phone, email, office address. Free consultation on web development.', 'Contact Us', 'en')
ON CONFLICT (page_slug, language) DO UPDATE SET 
  page_title = EXCLUDED.page_title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  h1_tag = EXCLUDED.h1_tag;