-- Add language column to company_info table
ALTER TABLE public.company_info ADD COLUMN language text NOT NULL DEFAULT 'ru';

-- Update existing record to be Russian version
UPDATE public.company_info SET language = 'ru', 
  description = 'Work4Studio — это команда профессионалов, специализирующихся на создании современных веб-сайтов и приложений. Мы объединяем креативность дизайна с передовыми технологиями разработки.',
  mission = 'Создаем уникальные веб-решения, которые помогают бизнесу расти и развиваться в цифровом мире',
  vision = 'Стать ведущей студией веб-разработки, известной инновационными решениями и безупречным качеством'
WHERE id = '44b1d81c-b0e0-4b0c-828c-80e3f70060db';

-- Create English version
INSERT INTO public.company_info (
  id, language, description, mission, vision, founding_year, team_size, projects_completed, clients_served, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'en',
  'Work4Studio is a team of professionals specializing in the creation of modern websites and applications. We combine creative design with cutting-edge development technologies.',
  'We create unique web solutions that help businesses grow and develop in the digital world.',
  'To become a leading web development studio known for innovative solutions and impeccable quality.',
  '2024',
  '8+',
  '20+',
  '30+',
  now(),
  now()
);

-- Add unique constraint for language
ALTER TABLE public.company_info ADD CONSTRAINT company_info_language_unique UNIQUE (language);