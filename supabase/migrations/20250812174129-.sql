-- Добавляем поля для навыков и опыта работы в переводы команды
ALTER TABLE team_member_translations 
ADD COLUMN skills text[] DEFAULT '{}',
ADD COLUMN experience text;