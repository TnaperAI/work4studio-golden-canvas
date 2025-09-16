-- Очистка всех таблиц проекта
-- Удаляем переводы (дочерние записи)
DELETE FROM case_translations;
DELETE FROM service_translations;
DELETE FROM team_member_translations;
DELETE FROM legal_document_translations;

-- Удаляем основные записи контента
DELETE FROM cases;
DELETE FROM services;
DELETE FROM team_members;
DELETE FROM legal_documents;

-- Удаляем пользовательские данные
DELETE FROM contact_submissions;
DELETE FROM content_posts;
DELETE FROM content_analytics;
DELETE FROM video_generations;
DELETE FROM social_accounts;
DELETE FROM business_profile;
DELETE FROM content_factory_settings;

-- Удаляем настройки сайта
DELETE FROM site_content;
DELETE FROM page_seo;
DELETE FROM company_info;

-- Удаляем роли пользователей (осторожно с этим!)
-- DELETE FROM user_roles;

-- Проверяем количество оставшихся записей в каждой таблице
SELECT 
  'cases' as table_name, COUNT(*) as count FROM cases
UNION ALL SELECT 'services', COUNT(*) FROM services
UNION ALL SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL SELECT 'content_posts', COUNT(*) FROM content_posts
UNION ALL SELECT 'site_content', COUNT(*) FROM site_content
UNION ALL SELECT 'page_seo', COUNT(*) FROM page_seo
UNION ALL SELECT 'company_info', COUNT(*) FROM company_info;