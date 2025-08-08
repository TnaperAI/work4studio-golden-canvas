-- Проверяем есть ли уже английская информация о компании
-- Если есть, обновляем её
UPDATE company_info 
SET mission = 'To help businesses grow through modern web technologies and innovative solutions',
    vision = 'To become a leading web development studio in Eastern Europe',
    founding_year = '2024',
    team_size = '5+',
    projects_completed = '50+',
    clients_served = '40+',
    description = 'Work4Studio is a modern web development studio specializing in creating effective digital solutions for businesses of all sizes.'
WHERE language = 'en';

-- Если записи нет, создаем её
INSERT INTO company_info (mission, vision, founding_year, team_size, projects_completed, clients_served, description, language) 
SELECT 'To help businesses grow through modern web technologies and innovative solutions', 'To become a leading web development studio in Eastern Europe', '2024', '5+', '50+', '40+', 'Work4Studio is a modern web development studio specializing in creating effective digital solutions for businesses of all sizes.', 'en'
WHERE NOT EXISTS (SELECT 1 FROM company_info WHERE language = 'en');