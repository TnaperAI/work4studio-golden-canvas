-- Insert default header content for Russian
INSERT INTO public.site_content (section, key, value, language) VALUES
('header', 'nav_home', 'Главная', 'ru'),
('header', 'nav_services', 'Услуги', 'ru'),
('header', 'nav_cases', 'Кейсы', 'ru'),
('header', 'nav_about', 'О нас', 'ru'),
('header', 'nav_contact', 'Контакты', 'ru'),
('header', 'cta_button', 'Обсудить проект', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default header content for English
INSERT INTO public.site_content (section, key, value, language) VALUES
('header', 'nav_home', 'Home', 'en'),
('header', 'nav_services', 'Services', 'en'),
('header', 'nav_cases', 'Cases', 'en'),
('header', 'nav_about', 'About', 'en'),
('header', 'nav_contact', 'Contact', 'en'),
('header', 'cta_button', 'Discuss Project', 'en')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default hero content for Russian
INSERT INTO public.site_content (section, key, value, language) VALUES
('hero', 'title', 'Создаём сайты, которые приносят клиентов', 'ru'),
('hero', 'subtitle', 'Разрабатываем современные веб-решения для малого и среднего бизнеса', 'ru'),
('hero', 'cta_button', 'Получить консультацию', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default hero content for English
INSERT INTO public.site_content (section, key, value, language) VALUES
('hero', 'title', 'Creating websites that bring clients', 'en'),
('hero', 'subtitle', 'We develop modern web solutions for small and medium businesses', 'en'),
('hero', 'cta_button', 'Get Consultation', 'en')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default services section content for Russian
INSERT INTO public.site_content (section, key, value, language) VALUES
('services', 'title', 'Наши', 'ru'),
('services', 'subtitle', 'Полный цикл работы с вашим веб-проектом от идеи до запуска', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default services section content for English
INSERT INTO public.site_content (section, key, value, language) VALUES
('services', 'title', 'Our', 'en'),
('services', 'subtitle', 'Full cycle of work with your web project from idea to launch', 'en')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default stats content for Russian
INSERT INTO public.site_content (section, key, value, language) VALUES
('stats', 'days', '14', 'ru'),
('stats', 'days_text', 'дней средний срок', 'ru'),
('stats', 'projects', '50+', 'ru'),
('stats', 'projects_text', 'успешных проектов', 'ru'),
('stats', 'satisfaction', '98%', 'ru'),
('stats', 'satisfaction_text', 'довольных клиентов', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;

-- Insert default stats content for English
INSERT INTO public.site_content (section, key, value, language) VALUES
('stats', 'days', '14', 'en'),
('stats', 'days_text', 'days average time', 'en'),
('stats', 'projects', '50+', 'en'),
('stats', 'projects_text', 'successful projects', 'en'),
('stats', 'satisfaction', '98%', 'en'),
('stats', 'satisfaction_text', 'satisfied clients', 'en')
ON CONFLICT (section, key, language) DO UPDATE SET value = EXCLUDED.value;