-- Add missing RLS policies for contact submissions management
CREATE POLICY "Admins can update submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins can delete submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));