-- Обновляем SEO данные для основных страниц

-- Главная страница EN
UPDATE page_seo SET 
  og_title = 'Professional Website Development | Work4Studio',
  og_description = 'Custom website development for business. Landing pages, corporate websites, and e-commerce solutions. Responsive design, SEO optimization, and fast launch.',
  og_image = 'https://work4studio.com/og-image.jpg'
WHERE page_slug = 'home' AND language = 'en';

-- Услуги EN
UPDATE page_seo SET 
  og_title = 'Web Development Services | Work4Studio',
  og_description = 'Full-cycle website development services. We create websites tailored to your business needs. Landing pages, corporate sites, and e-commerce with fast loading and SEO.',
  og_image = 'https://work4studio.com/og/services.jpg'
WHERE page_slug = 'services' AND language = 'en';

-- О нас EN
UPDATE page_seo SET 
  og_title = 'About Work4Studio - Professional Web Development Team',
  og_description = 'Professional team specializing in modern web development. We combine creative design with cutting-edge development technologies.',
  og_image = 'https://work4studio.com/og-about.jpg'
WHERE page_slug = 'about' AND language = 'en';

-- Контакты EN
UPDATE page_seo SET 
  og_title = 'Contact Work4Studio - Get Professional Website',
  og_description = 'Contact us for a free consultation. We respond quickly and help with any website development questions.',
  og_image = 'https://work4studio.com/og/contacts.jpg'
WHERE page_slug = 'contact' AND language = 'en';

-- Кейсы EN
UPDATE page_seo SET 
  og_title = 'Work4Studio Portfolio - Examples of Our Work',
  og_description = 'Portfolio of successful projects that deliver real results for our clients. See examples of our websites and applications.',
  og_image = 'https://work4studio.com/og/cases.jpg'
WHERE page_slug = 'cases' AND language = 'en';

-- Обновляем недостающие данные для русских страниц
UPDATE page_seo SET 
  og_description = 'Примеры успешных проектов, которые приносят реальные результаты нашим клиентам. Смотрите работы студии.',
  og_image = 'https://work4studio.com/og/cases.jpg'
WHERE page_slug = 'cases' AND language = 'ru' AND (og_description IS NULL OR og_title IS NULL);

UPDATE page_seo SET 
  og_title = 'Портфолио Work4Studio - примеры наших работ'
WHERE page_slug = 'cases' AND language = 'ru' AND og_title IS NULL;

-- Обновляем SEO данные для кейсов

-- Кейс TechPromSnab RU
UPDATE case_translations SET 
  og_title = 'Разработка B2B каталога «ТехПромСнаб» | Work4Studio',
  og_description = 'Современный сайт-каталог для промышленной компании «ТехПромСнаб» с каталогом продукции, админкой и адаптивной версткой.',
  og_image = 'https://work4studio.com/og/cases/tehpromsnab.jpg'
WHERE case_id IN (SELECT id FROM cases WHERE slug = 'b2b-sayt-katalog-dlya-promyshlennoy-kompanii-tehpromsnab') 
  AND language = 'ru';

-- Кейс Luxury Development RU
UPDATE case_translations SET 
  meta_title = 'Лендинг для застройщика Luxury Development | Work4Studio',
  og_title = 'Лендинг для застройщика Luxury Development — Work4Studio',
  og_description = 'Современный лендинг для застройщика элитной недвижимости с интерактивными элементами, галереей и формами обратной связи.',
  og_image = 'https://work4studio.com/og/cases/luxury-development.jpg'
WHERE case_id IN (SELECT id FROM cases WHERE slug = 'lending-dlya-zastroyschika-luxury-development') 
  AND language = 'ru';

-- Кейс Luxury Development EN
UPDATE case_translations SET 
  meta_title = 'Landing Page for Luxury Development Company | Work4Studio',
  og_title = 'Luxury Development Landing Page — Work4Studio',
  og_description = 'Modern landing page for luxury real estate developer with interactive elements, gallery, and contact forms.',
  og_image = 'https://work4studio.com/og/cases/luxury-development.jpg'
WHERE case_id IN (SELECT id FROM cases WHERE slug = 'lending-dlya-zastroyschika-luxury-development') 
  AND language = 'en';

-- Кейс CRM для команды RU
UPDATE case_translations SET 
  meta_title = 'CRM для команды по синхронному плаванию | Work4Studio',
  og_title = 'CRM система для спортивной команды — Work4Studio',
  og_description = 'Разработка CRM системы для управления спортивной командой по синхронному плаванию с расписанием тренировок.',
  og_image = 'https://work4studio.com/og/cases/swimming-crm.jpg'
WHERE case_id IN (SELECT id FROM cases WHERE slug = 'crm-dlya-komandy-po-sinhronnomu-plavaniyu-shooting') 
  AND language = 'ru';

-- Кейс CRM для команды EN
UPDATE case_translations SET 
  meta_title = 'CRM for Synchronized Swimming Team | Work4Studio',
  og_title = 'Sports Team CRM System — Work4Studio',
  og_description = 'Development of CRM system for managing synchronized swimming team with training schedules and member management.',
  og_image = 'https://work4studio.com/og/cases/swimming-crm.jpg'
WHERE case_id IN (SELECT id FROM cases WHERE slug = 'crm-dlya-komandy-po-sinhronnomu-plavaniyu-shooting') 
  AND language = 'en';

-- Добавляем недостающие переводы для кейсов, если их нет
INSERT INTO case_translations (case_id, language, title, short_description, description, results, meta_title, og_title, og_description, og_image)
SELECT 
  c.id,
  'ru',
  c.title,
  c.short_description,
  c.description,
  c.results,
  COALESCE(c.meta_title, c.title || ' | Work4Studio'),
  COALESCE(c.og_title, c.title || ' — Work4Studio'),
  COALESCE(c.og_description, c.short_description),
  COALESCE(c.og_image, 'https://work4studio.com/og/cases/default.jpg')
FROM cases c
WHERE c.is_active = true 
  AND NOT EXISTS (
    SELECT 1 FROM case_translations ct 
    WHERE ct.case_id = c.id AND ct.language = 'ru'
  );

-- Обновляем данные для отдельных услуг
UPDATE page_seo SET 
  og_title = COALESCE(meta_title, 'Услуга Work4Studio'),
  og_description = COALESCE(meta_description, 'Профессиональная веб-разработка от Work4Studio'),
  og_image = 'https://work4studio.com/og/services.jpg'
WHERE page_slug LIKE 'services/%' AND language = 'ru' AND (og_title IS NULL OR og_description IS NULL);