-- Fix critical security vulnerability: Restrict contact submissions access to admins/editors only

-- Drop the insecure policy that allows anyone to view all submissions
DROP POLICY IF EXISTS "Admin can view all submissions" ON contact_submissions;

-- Create a secure policy that only allows admins and editors to view submissions
CREATE POLICY "Only admins and editors can view submissions" 
ON contact_submissions 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role)
);