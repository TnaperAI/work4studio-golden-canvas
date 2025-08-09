-- Create translations table for cases
CREATE TABLE IF NOT EXISTS public.case_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  results TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  h1_tag TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT case_translations_unique_lang UNIQUE (case_id, language)
);

-- Enable RLS
ALTER TABLE public.case_translations ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
  -- Drop existing policies if re-running
  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'case_translations' AND policyname = 'Allow select for all';
  IF FOUND THEN EXECUTE 'DROP POLICY "Allow select for all" ON public.case_translations'; END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'case_translations' AND policyname = 'Only admins can insert case translations';
  IF FOUND THEN EXECUTE 'DROP POLICY "Only admins can insert case translations" ON public.case_translations'; END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'case_translations' AND policyname = 'Only admins can update case translations';
  IF FOUND THEN EXECUTE 'DROP POLICY "Only admins can update case translations" ON public.case_translations'; END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'case_translations' AND policyname = 'Only admins can delete case translations';
  IF FOUND THEN EXECUTE 'DROP POLICY "Only admins can delete case translations" ON public.case_translations'; END IF;
END $$;

CREATE POLICY "Allow select for all"
ON public.case_translations
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert case translations"
ON public.case_translations
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update case translations"
ON public.case_translations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete case translations"
ON public.case_translations
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Trigger to auto-update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_case_translations_updated_at'
  ) THEN
    CREATE TRIGGER update_case_translations_updated_at
    BEFORE UPDATE ON public.case_translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_case_translations_case_id ON public.case_translations(case_id);
CREATE INDEX IF NOT EXISTS idx_case_translations_language ON public.case_translations(language);
