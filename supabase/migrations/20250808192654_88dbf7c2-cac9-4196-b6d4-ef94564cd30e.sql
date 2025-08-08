-- Добавляем английский контент для основных страниц

-- Главная страница - Hero секция
INSERT INTO site_content (section, key, value, language) VALUES
('hero', 'title', 'Professional Web Development', 'en'),
('hero', 'subtitle', 'We create modern, fast, and effective websites that help your business grow and attract customers', 'en'),
('hero', 'button_text', 'Discuss Project', 'en'),
('hero', 'stats_projects', '50+', 'en'),
('hero', 'stats_projects_label', 'Completed Projects', 'en'),
('hero', 'stats_clients', '40+', 'en'),
('hero', 'stats_clients_label', 'Satisfied Clients', 'en'),
('hero', 'stats_experience', '3+', 'en'),
('hero', 'stats_experience_label', 'Years of Experience', 'en');

-- Услуги секция
INSERT INTO site_content (section, key, value, language) VALUES
('services', 'title', 'Our Services', 'en'),
('services', 'subtitle', 'Full-cycle web development for your business', 'en'),
('services', 'button_text', 'View All Services', 'en');

-- Преимущества
INSERT INTO site_content (section, key, value, language) VALUES
('advantages', 'title', 'Why Choose Work4Studio', 'en'),
('advantages', 'subtitle', 'We offer comprehensive solutions for your business development', 'en'),
('advantages', 'item1_title', 'Individual Approach', 'en'),
('advantages', 'item1_description', 'We develop unique solutions tailored to your business needs', 'en'),
('advantages', 'item2_title', 'Modern Technologies', 'en'),
('advantages', 'item2_description', 'We use the latest tools and frameworks for maximum efficiency', 'en'),
('advantages', 'item3_title', 'Support and Maintenance', 'en'),
('advantages', 'item3_description', 'We provide ongoing support and website maintenance after launch', 'en'),
('advantages', 'item4_title', 'Fast Delivery', 'en'),
('advantages', 'item4_description', 'We complete projects on time without compromising quality', 'en');

-- Кейсы секция
INSERT INTO site_content (section, key, value, language) VALUES
('cases', 'title', 'Our Work', 'en'),
('cases', 'subtitle', 'Projects we''re proud of', 'en'),
('cases', 'button_text', 'View All Cases', 'en');

-- CTA секция
INSERT INTO site_content (section, key, value, language) VALUES
('cta', 'title', 'Ready to Start Your Project?', 'en'),
('cta', 'subtitle', 'Contact us for a free consultation and cost estimate', 'en'),
('cta', 'button_text', 'Discuss Project', 'en');

-- Контакты
INSERT INTO site_content (section, key, value, language) VALUES
('contact', 'title', 'Contact Us', 'en'),
('contact', 'subtitle', 'We''re ready to help you achieve your goals', 'en'),
('contact', 'address_title', 'Our Address', 'en'),
('contact', 'address', 'Online', 'en'),
('contact', 'phone_title', 'Phone', 'en'),
('contact', 'phone', '+7 (XXX) XXX-XX-XX', 'en'),
('contact', 'email_title', 'Email', 'en'),
('contact', 'email', 'info@work4studio.ru', 'en'),
('contact', 'form_title', 'Send Us a Message', 'en'),
('contact', 'form_subtitle', 'We''ll respond within an hour', 'en');

-- Страница услуг
INSERT INTO site_content (section, key, value, language) VALUES
('services_page', 'title', 'Our Services', 'en'),
('services_page', 'subtitle', 'Full-cycle web development for your business', 'en'),
('services_page', 'description', 'We offer comprehensive web development services - from idea to launch and ongoing support. Our team creates modern, fast, and effective solutions that help your business grow.', 'en');

-- О компании
INSERT INTO site_content (section, key, value, language) VALUES
('about', 'title', 'About Work4Studio', 'en'),
('about', 'subtitle', 'Professional web development team', 'en'),
('about', 'description', 'We are a team of professionals specializing in web development and digital solutions. Our goal is to help businesses grow through modern and effective web technologies.', 'en'),
('about', 'team_title', 'Our Team', 'en'),
('about', 'team_subtitle', 'Professionals who make your ideas reality', 'en');

-- Английская информация о компании
INSERT INTO company_info (mission, vision, founding_year, team_size, projects_completed, clients_served, description, language) VALUES
('To help businesses grow through modern web technologies and innovative solutions', 'To become a leading web development studio in Eastern Europe', '2024', '5+', '50+', '40+', 'Work4Studio is a modern web development studio specializing in creating effective digital solutions for businesses of all sizes.', 'en');