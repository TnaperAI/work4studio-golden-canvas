-- Update default language from 'ru' to 'en' for all SEO and content tables

-- Update page_seo table default language
ALTER TABLE public.page_seo 
ALTER COLUMN language SET DEFAULT 'en'::text;

-- Update site_content table default language  
ALTER TABLE public.site_content 
ALTER COLUMN language SET DEFAULT 'en'::text;

-- Update company_info table default language
ALTER TABLE public.company_info 
ALTER COLUMN language SET DEFAULT 'en'::text;

-- Update team_member_translations table default language
ALTER TABLE public.team_member_translations 
ALTER COLUMN language SET DEFAULT 'en'::text;