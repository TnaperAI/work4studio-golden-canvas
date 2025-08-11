-- Create team member translations table
CREATE TABLE public.team_member_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'ru',
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_member_id, language)
);

-- Enable RLS
ALTER TABLE public.team_member_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for team member translations
CREATE POLICY "Anyone can view team member translations" 
ON public.team_member_translations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can create team member translations" 
ON public.team_member_translations 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update team member translations" 
ON public.team_member_translations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete team member translations" 
ON public.team_member_translations 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_member_translations_updated_at
BEFORE UPDATE ON public.team_member_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();