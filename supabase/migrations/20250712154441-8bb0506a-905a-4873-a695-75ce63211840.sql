-- Создаем enum для типов компаний
CREATE TYPE public.company_type AS ENUM ('ip', 'ooo', 'zao', 'pao', 'other');

-- Создаем enum для стран
CREATE TYPE public.country_code AS ENUM ('by', 'ru', 'kz');

-- Создаем enum для статусов лидов
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'proposal_sent', 'in_negotiation', 'closed_won', 'closed_lost', 'not_interested');

-- Таблица для хранения спарсенных компаний
CREATE TABLE public.parsed_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_type company_type NOT NULL DEFAULT 'ooo',
  registration_number TEXT,
  country country_code NOT NULL,
  region TEXT,
  city TEXT,
  address TEXT,
  registration_date DATE,
  email TEXT,
  phone TEXT,
  website TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  industry TEXT,
  notes TEXT,
  source_url TEXT,
  parsed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для шаблонов писем
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB, -- список переменных типа {company_name}, {industry}
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для истории рассылок
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.parsed_companies(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.email_templates(id),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, delivered, opened, clicked, replied, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица для конфигурации парсеров
CREATE TABLE public.parser_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country country_code NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_parsed_date DATE,
  parsing_frequency INTEGER DEFAULT 1, -- дни
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.parsed_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parser_configs ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Admins can manage parsed companies" ON public.parsed_companies FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Editors can view and update parsed companies" ON public.parsed_companies FOR SELECT USING (has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Editors can update company status" ON public.parsed_companies FOR UPDATE USING (has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage email templates" ON public.email_templates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Editors can view email templates" ON public.email_templates FOR SELECT USING (has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Editors can view email campaigns" ON public.email_campaigns FOR SELECT USING (has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Editors can create email campaigns" ON public.email_campaigns FOR INSERT WITH CHECK (has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage parser configs" ON public.parser_configs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Триггеры для обновления timestamps
CREATE TRIGGER update_parsed_companies_updated_at
  BEFORE UPDATE ON public.parsed_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parser_configs_updated_at
  BEFORE UPDATE ON public.parser_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Индексы для оптимизации
CREATE INDEX idx_parsed_companies_status ON public.parsed_companies(status);
CREATE INDEX idx_parsed_companies_country ON public.parsed_companies(country);
CREATE INDEX idx_parsed_companies_parsed_at ON public.parsed_companies(parsed_at);
CREATE INDEX idx_email_campaigns_company_id ON public.email_campaigns(company_id);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);

-- Добавляем начальные данные
INSERT INTO public.email_templates (name, subject, content, variables) VALUES 
('Новый бизнес - предложение сайта', 
'Поздравляем с открытием {company_name}! 🎉', 
'Здравствуйте!

Поздравляю с регистрацией {company_name}! 

Заметил, что вы только что открыли бизнес. Это отличное начало!

Если вам нужен профессиональный сайт под ключ - мы сделаем его за 5 дней с учётом специфики вашей ниши. У нас уже есть готовые шаблоны для быстрого старта.

🔹 Разработка за 5 дней
🔹 Адаптивный дизайн
🔹 SEO-оптимизация
🔹 Готовые шаблоны под вашу нишу

Хотели бы обсудить детали?

С уважением,
Команда разработки', 
'["company_name", "industry"]');

INSERT INTO public.parser_configs (country, source_name, source_url, is_active) VALUES
('by', 'Единый государственный регистр Беларуси', 'https://egr.gov.by', true),
('ru', 'ЕГРЮЛ России', 'https://egrul.nalog.ru', true),
('kz', 'Регистр юридических лиц Казахстана', 'https://stat.gov.kz', true);