-- Add language column to site_content table
ALTER TABLE public.site_content 
ADD COLUMN language text NOT NULL DEFAULT 'ru';

-- Update existing records to have Russian language
UPDATE public.site_content 
SET language = 'ru' 
WHERE language IS NULL;

-- Create unique index on section, key, and language combination
CREATE UNIQUE INDEX idx_site_content_section_key_language 
ON public.site_content (section, key, language);

-- Drop the old unique constraint if it exists and create new one
ALTER TABLE public.site_content 
DROP CONSTRAINT IF EXISTS site_content_section_key_key;

-- Add new unique constraint
ALTER TABLE public.site_content 
ADD CONSTRAINT site_content_section_key_language_unique 
UNIQUE (section, key, language);