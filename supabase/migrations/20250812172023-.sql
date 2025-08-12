-- Fix critical security vulnerability: Restrict service translations access to admins/editors only

-- Drop all the insecure policies that allow anyone to do anything
DROP POLICY IF EXISTS "Allow delete for all" ON service_translations;
DROP POLICY IF EXISTS "Allow insert for all" ON service_translations;
DROP POLICY IF EXISTS "Allow select for all" ON service_translations;
DROP POLICY IF EXISTS "Allow update for all" ON service_translations;

-- Create secure policies for service translations

-- Only admins can create service translations
CREATE POLICY "Admins can create service translations" 
ON service_translations 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update service translations
CREATE POLICY "Admins can update service translations" 
ON service_translations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete service translations
CREATE POLICY "Admins can delete service translations" 
ON service_translations 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all service translations
CREATE POLICY "Admins can view all service translations" 
ON service_translations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can only view translations for active services
CREATE POLICY "Public can view active service translations" 
ON service_translations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_translations.service_id 
    AND services.is_active = true
  )
);