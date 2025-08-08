-- Создаем SEO запись для страницы about на русском языке
INSERT INTO page_seo (
  page_slug,
  page_title,
  meta_title,
  meta_description,
  meta_keywords,
  h1_tag,
  canonical_url,
  og_title,
  og_description,
  og_image,
  language
) VALUES (
  'about',
  'О нас - Work4Studio',
  'О нас | Work4Studio - Веб-студия полного цикла',
  'Узнайте больше о команде Work4Studio, наших ценностях и подходе к разработке веб-сайтов. Профессиональная веб-разработка с 2024 года.',
  'о нас, команда, веб-студия, разработка сайтов, Work4Studio',
  'О Work4Studio',
  'https://work4studio.ru/about',
  'О нас - Work4Studio',
  'Команда профессионалов в сфере веб-разработки. Создаем современные и эффективные веб-решения.',
  'https://work4studio.ru/og-about.jpg',
  'ru'
) ON CONFLICT (page_slug, language) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  h1_tag = EXCLUDED.h1_tag,
  canonical_url = EXCLUDED.canonical_url,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description,
  og_image = EXCLUDED.og_image;