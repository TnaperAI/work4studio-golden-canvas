-- Полное удаление всего проекта из БД

-- Удаляем все таблицы проекта (в правильном порядке с учетом foreign keys)
DROP TABLE IF EXISTS case_translations CASCADE;
DROP TABLE IF EXISTS service_translations CASCADE;
DROP TABLE IF EXISTS team_member_translations CASCADE;
DROP TABLE IF EXISTS legal_document_translations CASCADE;
DROP TABLE IF EXISTS content_analytics CASCADE;
DROP TABLE IF EXISTS video_generations CASCADE;
DROP TABLE IF EXISTS content_posts CASCADE;
DROP TABLE IF EXISTS social_accounts CASCADE;
DROP TABLE IF EXISTS business_profile CASCADE;
DROP TABLE IF EXISTS content_factory_settings CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS legal_documents CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS page_seo CASCADE;
DROP TABLE IF EXISTS company_info CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Удаляем функции
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Удаляем enum типы
DROP TYPE IF EXISTS app_role CASCADE;
DROP TYPE IF EXISTS case_category CASCADE;

-- Удаляем storage buckets
DELETE FROM storage.objects WHERE bucket_id IN ('case-images', 'team-images');
DELETE FROM storage.buckets WHERE id IN ('case-images', 'team-images');

-- Проверяем что осталось в public схеме
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;