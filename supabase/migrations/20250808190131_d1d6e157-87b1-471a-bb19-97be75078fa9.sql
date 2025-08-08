-- Добавляем недостающие поля для секции stats
INSERT INTO site_content (section, key, value, language) VALUES
('stats', 'days', '3', 'ru'),
('stats', 'days_text', 'дня на запуск', 'ru'),
('stats', 'support', '3', 'ru'),
('stats', 'support_text', 'месяца поддержки', 'ru'),
('stats', 'code', '100', 'ru'),
('stats', 'code_text', '% открытый код', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET
  value = EXCLUDED.value;

-- Добавляем недостающие поля для секции services
INSERT INTO site_content (section, key, value, language) VALUES
('services', 'title', 'Наши услуги', 'ru'),
('services', 'subtitle', 'Полный цикл разработки веб-решений', 'ru'),
('services', 'main_title', 'Разработка сайтов под ключ', 'ru'),
('services', 'main_description', 'Создаём современные веб-сайты, которые привлекают клиентов и увеличивают продажи. От идеи до запуска — берём на себя весь процесс.', 'ru'),
('services', 'features', 'Адаптивный дизайн, SEO-оптимизация, Быстрая загрузка, Удобная админка', 'ru'),
('services', 'button', 'Все услуги', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET
  value = EXCLUDED.value;

-- Добавляем недостающие поля для hero секции (преимущества)
INSERT INTO site_content (section, key, value, language) VALUES
('hero', 'advantage_1_title', 'Быстрый старт от 3 дней', 'ru'),
('hero', 'advantage_1_description', 'Не тратим время на лишние созвоны — чётко формулируем задачу, делаем макет, запускаем', 'ru'),
('hero', 'advantage_2_title', 'Открытый код и доступ к данным', 'ru'),
('hero', 'advantage_2_description', 'У вас будет доступ ко всем материалам — от админки до Git-репозитория. Всё прозрачно', 'ru'),
('hero', 'advantage_3_title', 'Минимум бюрократии', 'ru'),
('hero', 'advantage_3_description', 'Нет менеджеров ради менеджеров. Вы общаетесь напрямую с теми, кто делает', 'ru'),
('hero', 'advantage_4_title', 'Возможность доработки и развития', 'ru'),
('hero', 'advantage_4_description', 'Сайты, которые не придётся переделывать — всё адаптировано под рост', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET
  value = EXCLUDED.value;