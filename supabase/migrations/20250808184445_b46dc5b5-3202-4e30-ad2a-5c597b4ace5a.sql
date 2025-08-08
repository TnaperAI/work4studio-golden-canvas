-- Add missing English translations for About page
INSERT INTO public.site_content (section, key, value, language) VALUES
('about', 'breadcrumb_home', 'Home', 'en'),
('about', 'breadcrumb_about', 'About', 'en'),
('about', 'mission_title', 'Our Mission', 'en'),
('about', 'vision_title', 'Our Vision', 'en'),
('about', 'values_title_second', 'values', 'en'),
('about', 'team_title_first', 'Our', 'en'),
('about', 'team_title_second', 'team', 'en'),
('about', 'team_subtitle', 'Professionals who bring your ideas to life', 'en'),
('about', 'cta_title_first', 'Ready to start', 'en'),
('about', 'cta_title_second', 'a project?', 'en'),
('about', 'cta_subtitle', 'Contact us to discuss your project. We will help bring your ideas to life and create something amazing together.', 'en'),
('about', 'cta_button_text', 'Contact Us', 'en'),
('about', 'stats_founding_year_label', 'Founded', 'en'),
('about', 'stats_team_label', 'Team', 'en'),
('about', 'stats_projects_label', 'Projects Completed', 'en'),
('about', 'stats_clients_label', 'Happy Clients', 'en')
ON CONFLICT (section, key, language) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();