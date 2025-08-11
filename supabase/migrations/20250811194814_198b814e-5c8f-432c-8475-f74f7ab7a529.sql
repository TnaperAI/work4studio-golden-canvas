-- Удаление всех таблиц связанных с функционалом поиска компаний

-- Удаляем таблицу email_campaigns
DROP TABLE IF EXISTS email_campaigns CASCADE;

-- Удаляем таблицу email_templates  
DROP TABLE IF EXISTS email_templates CASCADE;

-- Удаляем таблицу parsed_companies
DROP TABLE IF EXISTS parsed_companies CASCADE;

-- Удаляем таблицу parser_configs
DROP TABLE IF EXISTS parser_configs CASCADE;