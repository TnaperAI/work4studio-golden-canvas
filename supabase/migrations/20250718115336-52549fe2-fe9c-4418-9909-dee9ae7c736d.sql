-- Создаем уникальный индекс для комбинации section и key в таблице site_content
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_content_section_key 
ON public.site_content (section, key);