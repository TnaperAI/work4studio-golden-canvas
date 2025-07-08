-- Create table for team members
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  image TEXT,
  skills TEXT[],
  experience TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for company information 
CREATE TABLE public.company_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission TEXT,
  vision TEXT,
  founding_year TEXT,
  team_size TEXT,
  projects_completed TEXT,
  clients_served TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Anyone can view active team members" 
ON public.team_members 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all team members" 
ON public.team_members 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create team members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update team members" 
ON public.team_members 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete team members" 
ON public.team_members 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for company_info
CREATE POLICY "Anyone can view company info" 
ON public.company_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage company info" 
ON public.company_info 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_info_updated_at
BEFORE UPDATE ON public.company_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default company info
INSERT INTO public.company_info (
  mission, vision, founding_year, team_size, projects_completed, clients_served, description
) VALUES (
  'Создаем уникальные веб-решения, которые помогают бизнесу расти и развиваться в цифровом мире',
  'Стать ведущей студией веб-разработки, известной инновационными решениями и безупречным качеством',
  '2019',
  '8+',
  '150+',
  '80+',
  'Work4Studio — это команда профессионалов, специализирующихся на создании современных веб-сайтов и приложений. Мы объединяем креативность дизайна с передовыми технологиями разработки.'
);

-- Insert default team members
INSERT INTO public.team_members (
  name, position, description, image, skills, experience, sort_order
) VALUES 
(
  'Алексей Петров',
  'Основатель & Lead Developer',
  'Эксперт в области веб-разработки с более чем 7-летним опытом. Специализируется на React, Node.js и архитектуре приложений.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  '7+ лет',
  1
),
(
  'Мария Сидорова',
  'UI/UX Designer',
  'Создает интуитивные и красивые интерфейсы. Имеет степень в области дизайна и опыт работы с крупными брендами.',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  ARRAY['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
  '5+ лет',
  2
),
(
  'Дмитрий Козлов',
  'Frontend Developer',
  'Специалист по frontend-разработке с фокусом на производительность и пользовательский опыт.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  ARRAY['React', 'Vue.js', 'CSS/SCSS', 'WebPack'],
  '4+ года',
  3
);