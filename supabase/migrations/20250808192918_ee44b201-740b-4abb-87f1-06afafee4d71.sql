-- Добавляем русский контент для сайта
INSERT INTO site_content (section, key, value, language) VALUES
-- Главная страница - Hero секция (русский)
('hero', 'title', 'Создаём сайты, которые приносят клиентов', 'ru'),
('hero', 'subtitle', 'Современные веб-решения для роста вашего бизнеса и привлечения клиентов', 'ru'),
('hero', 'button_text', 'Обсудить проект', 'ru'),
('hero', 'stats_projects', '50+', 'ru'),
('hero', 'stats_projects_label', 'Проектов выполнено', 'ru'),
('hero', 'stats_clients', '40+', 'ru'),
('hero', 'stats_clients_label', 'Довольных клиентов', 'ru'),
('hero', 'stats_experience', '3+', 'ru'),
('hero', 'stats_experience_label', 'Лет опыта', 'ru'),

-- Услуги секция (русский)
('services', 'title', 'Наши услуги', 'ru'),
('services', 'subtitle', 'Полный цикл веб-разработки для вашего бизнеса', 'ru'),
('services', 'button_text', 'Посмотреть все услуги', 'ru'),

-- Преимущества (русский)
('advantages', 'title', 'Почему выбирают Work4Studio', 'ru'),
('advantages', 'subtitle', 'Мы предлагаем комплексные решения для развития вашего бизнеса', 'ru'),
('advantages', 'item1_title', 'Индивидуальный подход', 'ru'),
('advantages', 'item1_description', 'Разрабатываем уникальные решения под потребности вашего бизнеса', 'ru'),
('advantages', 'item2_title', 'Современные технологии', 'ru'),
('advantages', 'item2_description', 'Используем новейшие инструменты и фреймворки для максимальной эффективности', 'ru'),
('advantages', 'item3_title', 'Поддержка и сопровождение', 'ru'),
('advantages', 'item3_description', 'Предоставляем постоянную поддержку и обслуживание сайта после запуска', 'ru'),
('advantages', 'item4_title', 'Быстрая реализация', 'ru'),
('advantages', 'item4_description', 'Выполняем проекты в срок без ущерба качеству', 'ru'),

-- Кейсы секция (русский)
('cases', 'title', 'Наши работы', 'ru'),
('cases', 'subtitle', 'Проекты, которыми мы гордимся', 'ru'),
('cases', 'button_text', 'Посмотреть все кейсы', 'ru'),

-- CTA секция (русский)
('cta', 'title', 'Готовы начать ваш проект?', 'ru'),
('cta', 'subtitle', 'Свяжитесь с нами для бесплатной консультации и расчёта стоимости', 'ru'),
('cta', 'button_text', 'Обсудить проект', 'ru'),

-- Контакты (русский)
('contact', 'title', 'Контакты', 'ru'),
('contact', 'subtitle', 'Мы готовы помочь вам достичь ваших целей', 'ru'),
('contact', 'address_title', 'Наш адрес', 'ru'),
('contact', 'address', 'Онлайн', 'ru'),
('contact', 'phone_title', 'Телефон', 'ru'),
('contact', 'phone', '+7 (XXX) XXX-XX-XX', 'ru'),
('contact', 'email_title', 'Email', 'ru'),
('contact', 'email', 'info@work4studio.ru', 'ru'),
('contact', 'form_title', 'Отправьте нам сообщение', 'ru'),
('contact', 'form_subtitle', 'Ответим в течение часа', 'ru'),

-- Страница услуг (русский)
('services_page', 'title', 'Наши услуги', 'ru'),
('services_page', 'subtitle', 'Полный цикл веб-разработки для вашего бизнеса', 'ru'),
('services_page', 'description', 'Предлагаем комплексные услуги веб-разработки - от идеи до запуска и постоянной поддержки. Наша команда создаёт современные, быстрые и эффективные решения, которые помогают вашему бизнесу расти.', 'ru'),

-- О компании (русский)
('about', 'title', 'О Work4Studio', 'ru'),
('about', 'subtitle', 'Команда профессионалов веб-разработки', 'ru'),
('about', 'description', 'Мы команда профессионалов, специализирующихся на веб-разработке и цифровых решениях. Наша цель - помочь бизнесу расти через современные и эффективные веб-технологии.', 'ru'),
('about', 'team_title', 'Наша команда', 'ru'),
('about', 'team_subtitle', 'Профессионалы, которые воплощают ваши идеи в реальность', 'ru')

ON CONFLICT (section, key, language) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();