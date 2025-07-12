-- Добавляем контент для страницы услуг в таблицу site_content
INSERT INTO public.site_content (section, key, value) VALUES
-- Секция services для страницы /services
('services', 'title', 'Разрабатываем сайты под ключ'),
('services', 'subtitle', 'Выбираем подходящий формат — от посадочной страницы до интернет-магазина. Настраиваем под ваши цели и задачи.'),
('services', 'badge_1_text', 'От 3 дней до запуска'),
('services', 'badge_2_text', 'Открытый код и доступ'),
('services', 'grid_title', 'Выберите формат'),
('services', 'grid_subtitle', 'Дизайн, код и запуск — всё, что нужно для старта онлайн. Выбираем формат под ваши цели.'),
('services', 'cta_title', 'Не знаете, какой формат подойдёт?'),
('services', 'cta_subtitle', 'Расскажите о своих задачах — поможем выбрать оптимальное решение и запустим проект в кратчайшие сроки'),
('services', 'cta_button', 'Получить консультацию')
ON CONFLICT (section, key) DO UPDATE SET
value = EXCLUDED.value,
updated_at = now();