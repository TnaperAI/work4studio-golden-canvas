-- Создаем русскую запись в company_info
INSERT INTO company_info (
  mission, 
  vision, 
  founding_year, 
  team_size, 
  projects_completed, 
  clients_served, 
  description, 
  language
) VALUES (
  'Создаём уникальные веб-решения, которые помогают бизнесу расти и развиваться в цифровом мире',
  'Стать ведущей веб-студией, известной инновационными решениями и безупречным качеством',
  '2024',
  '8+',
  '20+',
  '30+',
  'Work4Studio — команда профессионалов, специализирующихся на создании современных сайтов и приложений. Мы сочетаем креативный дизайн с передовыми технологиями разработки',
  'ru'
) ON CONFLICT (id) DO NOTHING;

-- Добавляем недостающие поля для about секции
INSERT INTO site_content (section, key, value, language) VALUES
('about', 'team_title_first', 'Наша', 'ru'),
('about', 'team_title_second', 'команда', 'ru'),
('about', 'team_subtitle', 'Профессионалы, которые воплощают ваши идеи в жизнь', 'ru'),
('about', 'mission_title', 'Наша миссия', 'ru'),
('about', 'vision_title', 'Наше видение', 'ru'),
('about', 'stats_founding_year_label', 'Год основания', 'ru'),
('about', 'stats_team_label', 'Команда', 'ru'),
('about', 'stats_projects_label', 'Проектов завершено', 'ru'),
('about', 'stats_clients_label', 'Довольных клиентов', 'ru'),
('about', 'breadcrumb_home', 'Главная', 'ru'),
('about', 'breadcrumb_about', 'О нас', 'ru'),
('about', 'cta_title_first', 'Готовы начать', 'ru'),
('about', 'cta_title_second', 'проект?', 'ru'),
('about', 'cta_subtitle', 'Свяжитесь с нами, чтобы обсудить ваш проект. Мы поможем воплотить ваши идеи в жизнь и создать что-то удивительное вместе', 'ru'),
('about', 'cta_button_text', 'Связаться с нами', 'ru')
ON CONFLICT (section, key, language) DO UPDATE SET
  value = EXCLUDED.value;