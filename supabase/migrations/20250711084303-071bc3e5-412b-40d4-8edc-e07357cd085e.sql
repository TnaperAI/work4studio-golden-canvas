-- Add source column to contact_submissions table
ALTER TABLE public.contact_submissions 
ADD COLUMN source TEXT DEFAULT 'unknown';

-- Add comment for documentation
COMMENT ON COLUMN public.contact_submissions.source IS 'Source of the contact submission (e.g., homepage, contact_page, services, header, footer, modal)';