-- Add advantages field to services table
ALTER TABLE public.services 
ADD COLUMN advantages text[] DEFAULT ARRAY['Бесплатная консультация', 'Ответим в течение часа', 'Поддержка 3 месяца'];