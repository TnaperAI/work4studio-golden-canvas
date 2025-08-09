-- Upsert English translations for existing services
-- Service: Landing Page
UPDATE public.service_translations SET
  title = $$Landing Page$$,
  short_description = $$A single-page website tailored to a specific offer. Works great for ads and traffic.$$,
  description = $$A one-page website that helps sell a product, service, or idea. Focused on conversion and fast launch.$$,
  features = ARRAY['Task and reference analysis','Turnkey landing page development','Feature integrations','SEO and performance optimization','Publishing and QA','Support — 1 month'],
  advantages = ARRAY['Free consultation','We respond within an hour','Free 1-month support'],
  faq = jsonb_build_array(
    jsonb_build_object('question','How long will development take?','answer','Depending on complexity, from 3 to 14 business days.'),
    jsonb_build_object('question','What do you need from me to get started?','answer','Examples of sites you like, a brief description of your product or service, contact details, and any preferences for structure or style.'),
    jsonb_build_object('question','Can we make changes after launch?','answer','Yes, two rounds of revisions after launch are included. Additional changes upon agreement.'),
    jsonb_build_object('question','Does the price include domain and email setup?','answer','Yes, we connect your domain, set up SSL and, if needed, business email.'),
    jsonb_build_object('question','Can I edit the site myself?','answer','Yes. An admin panel is included. You can edit text, images, links, and more without a developer. It’s easy and tailored for business owners.'),
    jsonb_build_object('question','What’s included in the 1-month support?','answer','Bug fixes, basic consultations, minor text/image updates — within reason and without changing core site logic.')
  ),
  meta_title = $$Turnkey Landing Page Development | Work4Studio$$,
  meta_description = $$We create high-converting landing pages fast. Maximum conversions, no fluff. Perfect for ads, product launches, and lead capture.$$,
  meta_keywords = $$landing page, landing, conversion page, order landing, turnkey landing, landing design, landing for business$$,
  h1_tag = $$Landing Page — Conversion-focused, turnkey$$,
  canonical_url = 'https://work4studio.com/services/landing',
  og_title = $$Turnkey Landing Page — High-converting landing$$,
  og_description = $$A landing page that delivers results. From design to launch — fast, clear, to the point.$$,
  og_image = 'https://work4studio.com/og/landing.jpg'
WHERE service_id = '0fc8be43-a935-417f-96d8-db4a84b216ed' AND language = 'en';

INSERT INTO public.service_translations(
  service_id, language, title, short_description, description, features, advantages, faq,
  meta_title, meta_description, meta_keywords, h1_tag, canonical_url, og_title, og_description, og_image
)
SELECT 
  '0fc8be43-a935-417f-96d8-db4a84b216ed','en',
  $$Landing Page$$,
  $$A single-page website tailored to a specific offer. Works great for ads and traffic.$$,
  $$A one-page website that helps sell a product, service, or idea. Focused on conversion and fast launch.$$,
  ARRAY['Task and reference analysis','Turnkey landing page development','Feature integrations','SEO and performance optimization','Publishing and QA','Support — 1 month'],
  ARRAY['Free consultation','We respond within an hour','Free 1-month support'],
  jsonb_build_array(
    jsonb_build_object('question','How long will development take?','answer','Depending on complexity, from 3 to 14 business days.'),
    jsonb_build_object('question','What do you need from me to get started?','answer','Examples of sites you like, a brief description of your product or service, contact details, and any preferences for structure or style.'),
    jsonb_build_object('question','Can we make changes after launch?','answer','Yes, two rounds of revisions after launch are included. Additional changes upon agreement.'),
    jsonb_build_object('question','Does the price include domain and email setup?','answer','Yes, we connect your domain, set up SSL and, if needed, business email.'),
    jsonb_build_object('question','Can I edit the site myself?','answer','Yes. An admin panel is included. You can edit text, images, links, and more without a developer. It’s easy and tailored for business owners.'),
    jsonb_build_object('question','What’s included in the 1-month support?','answer','Bug fixes, basic consultations, minor text/image updates — within reason and without changing core site logic.')
  ),
  $$Turnkey Landing Page Development | Work4Studio$$,
  $$We create high-converting landing pages fast. Maximum conversions, no fluff. Perfect for ads, product launches, and lead capture.$$,
  $$landing page, landing, conversion page, order landing, turnkey landing, landing design, landing for business$$,
  $$Landing Page — Conversion-focused, turnkey$$,
  'https://work4studio.com/services/landing',
  $$Turnkey Landing Page — High-converting landing$$,
  $$A landing page that delivers results. From design to launch — fast, clear, to the point.$$,
  'https://work4studio.com/og/landing.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.service_translations t WHERE t.service_id = '0fc8be43-a935-417f-96d8-db4a84b216ed' AND t.language = 'en'
);

-- Service: Corporate Website
UPDATE public.service_translations SET
  title = $$Corporate Website$$,
  short_description = $$A company website with services, team, and contact form. Ideal for B2B and service businesses.$$,
  description = $$A professional corporate website to represent your company online. Includes all essential sections: About, Services, Portfolio, Contacts.$$,
  features = ARRAY['Task and reference analysis','Turnkey development','Feature integrations','Content Management System (CMS)','SEO and optimization','Publishing and QA','Support — 1 month'],
  advantages = ARRAY['Free consultation','We respond within an hour','Free 1-month support'],
  faq = jsonb_build_array(
    jsonb_build_object('question','How long will development take?','answer','From 7 to 20 business days, depending on content volume and number of pages.'),
    jsonb_build_object('question','Is support included in the price?','answer','Yes, 1 month of basic technical support is included after delivery.'),
    jsonb_build_object('question','Can we make changes?','answer','Yes, two rounds of post-launch revisions are included. Additional changes upon agreement.'),
    jsonb_build_object('question','What do you need to get started?','answer','Examples of sites you like, a brief description of your product or service, contact details, and any preferences for structure or style.'),
    jsonb_build_object('question','Does pricing include domain and email setup?','answer','Yes, we connect your domain, set up SSL, and business email if needed.'),
    jsonb_build_object('question','Can I edit the site myself?','answer','Yes. An admin panel is included. You can edit text, images, links, and more without a developer.')
  ),
  meta_title = $$Turnkey Corporate Websites | Work4Studio$$,
  meta_description = $$We build corporate websites for companies: About, Services, Contacts, Portfolio. All included — from design to launch.$$,
  meta_keywords = $$corporate website, company website, website development, turnkey site, services, about, contacts, website design, CMS$$,
  h1_tag = $$Corporate Website — Professional development$$,
  canonical_url = 'https://work4studio.com/services/corporate',
  og_title = $$Corporate website — your company online$$,
  og_description = $$A professional corporate website with responsive design, content management, and SEO. A complete solution for business.$$,
  og_image = 'https://work4studio.com/og/corporate.jpg'
WHERE service_id = '93206230-5874-4210-b454-8e134d99e726' AND language = 'en';

INSERT INTO public.service_translations(
  service_id, language, title, short_description, description, features, advantages, faq,
  meta_title, meta_description, meta_keywords, h1_tag, canonical_url, og_title, og_description, og_image
)
SELECT 
  '93206230-5874-4210-b454-8e134d99e726','en',
  $$Corporate Website$$,
  $$A company website with services, team, and contact form. Ideal for B2B and service businesses.$$,
  $$A professional corporate website to represent your company online. Includes all essential sections: About, Services, Portfolio, Contacts.$$,
  ARRAY['Task and reference analysis','Turnkey development','Feature integrations','Content Management System (CMS)','SEO and optimization','Publishing and QA','Support — 1 month'],
  ARRAY['Free consultation','We respond within an hour','Free 1-month support'],
  jsonb_build_array(
    jsonb_build_object('question','How long will development take?','answer','From 7 to 20 business days, depending on content volume and number of pages.'),
    jsonb_build_object('question','Is support included in the price?','answer','Yes, 1 month of basic technical support is included after delivery.'),
    jsonb_build_object('question','Can we make changes?','answer','Yes, two rounds of post-launch revisions are included. Additional changes upon agreement.'),
    jsonb_build_object('question','What do you need to get started?','answer','Examples of sites you like, a brief description of your product or service, contact details, and any preferences for structure or style.'),
    jsonb_build_object('question','Does pricing include domain and email setup?','answer','Yes, we connect your domain, set up SSL, and business email if needed.'),
    jsonb_build_object('question','Can I edit the site myself?','answer','Yes. An admin panel is included. You can edit text, images, links, and more without a developer.')
  ),
  $$Turnkey Corporate Websites | Work4Studio$$,
  $$We build corporate websites for companies: About, Services, Contacts, Portfolio. All included — from design to launch.$$,
  $$corporate website, company website, website development, turnkey site, services, about, contacts, website design, CMS$$,
  $$Corporate Website — Professional development$$,
  'https://work4studio.com/services/corporate',
  $$Corporate website — your company online$$,
  $$A professional corporate website with responsive design, content management, and SEO. A complete solution for business.$$,
  'https://work4studio.com/og/corporate.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.service_translations t WHERE t.service_id = '93206230-5874-4210-b454-8e134d99e726' AND t.language = 'en'
);

-- Service: Online Store (E-commerce)
UPDATE public.service_translations SET
  title = $$Online Store$$,
  short_description = $$Catalog, cart, payments, and order system. Great for retail, wholesale, and online sales.$$,
  description = $$A turnkey online store — from product pages to checkout. Suitable for retail and wholesale, and includes everything to start selling online: cart, payments, filters, order management, and user accounts.
Built on a fast, reliable platform with room to scale and add new features.
Integrations with shipping services, online payments, CRM, and analytics.$$,
  features = ARRAY['Responsive design','Cart and checkout','Payment gateway integrations','Product categories and filters','Order and product management','SEO optimization','Content management system','CRM integration'],
  advantages = ARRAY['Free consultation','We respond within an hour','Free 1-month support'],
  faq = jsonb_build_array(
    jsonb_build_object('question','How long will development take?','answer','From 10 to 25 business days depending on product count and features.'),
    jsonb_build_object('question','Can we connect payments and shipping?','answer','Yes, we will integrate any payment systems and couriers you use.'),
    jsonb_build_object('question','Will I be able to add products myself?','answer','Yes, you’ll get access to the admin panel to add, edit, and delete products.'),
    jsonb_build_object('question','What’s included in support?','answer','Basic support covers bug fixes and admin help for 1 month.')
  ),
  meta_title = $$Online Store Development with Cart and Payments | Work4Studio$$,
  meta_description = $$We build full e-commerce sites: catalog, cart, payments, orders, analytics. Ready-to-launch turnkey solution.$$,
  meta_keywords = $$online store, ecommerce, store development, cart, online payments, product catalog, CMS, orders$$,
  h1_tag = $$Online Store — Catalog with cart and payments$$,
  canonical_url = 'https://work4studio.com/services/ecommerce',
  og_title = $$Online store — catalog, cart, payments$$,
  og_description = $$A complete e-commerce solution for retail and wholesale: product catalog, cart, payments, analytics. Easy admin included.$$,
  og_image = 'https://work4studio.com/og/ecommerce.jpg'
WHERE service_id = 'dfb6c90e-f8a6-4aff-8f25-b4bb8f889ea2' AND language = 'en';

INSERT INTO public.service_translations(
  service_id, language, title, short_description, description, features, advantages, faq,
  meta_title, meta_description, meta_keywords, h1_tag, canonical_url, og_title, og_description, og_image
)
SELECT 
  'dfb6c90e-f8a6-4aff-8f25-b4bb8f889ea2','en',
  $$Online Store$$,
  $$Catalog, cart, payments, and order system. Great for retail, wholesale, and online sales.$$,
  $$A turnkey online store — from product pages to checkout. Suitable for retail and wholesale, and includes everything to start selling online: cart, payments, filters, order management, and user accounts.
Built on a fast, reliable platform with room to scale and add new features.
Integrations with shipping services, online payments, CRM, and analytics.$$,
  ARRAY['Responsive design','Cart and checkout','Payment gateway integrations','Product categories and filters','Order and product management','SEO optimization','Content management system','CRM integration'],
  ARRAY['Free consultation','We respond within an hour','Free 1-month support'],
  jsonb_build_array(
    jsonb_build_object('question','How long will development take?','answer','From 10 to 25 business days depending on product count and features.'),
    jsonb_build_object('question','Can we connect payments and shipping?','answer','Yes, we will integrate any payment systems and couriers you use.'),
    jsonb_build_object('question','Will I be able to add products myself?','answer','Yes, you’ll get access to the admin panel to add, edit, and delete products.'),
    jsonb_build_object('question','What’s included in support?','answer','Basic support covers bug fixes and admin help for 1 month.')
  ),
  $$Online Store Development with Cart and Payments | Work4Studio$$,
  $$We build full e-commerce sites: catalog, cart, payments, orders, analytics. Ready-to-launch turnkey solution.$$,
  $$online store, ecommerce, store development, cart, online payments, product catalog, CMS, orders$$,
  $$Online Store — Catalog with cart and payments$$,
  'https://work4studio.com/services/ecommerce',
  $$Online store — catalog, cart, payments$$,
  $$A complete e-commerce solution for retail and wholesale: product catalog, cart, payments, analytics. Easy admin included.$$,
  'https://work4studio.com/og/ecommerce.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.service_translations t WHERE t.service_id = 'dfb6c90e-f8a6-4aff-8f25-b4bb8f889ea2' AND t.language = 'en'
);

-- Service: CRM System
UPDATE public.service_translations SET
  title = $$CRM System$$,
  short_description = $$Custom CRM to manage customers, sales, and internal processes.$$,
  description = $$A CRM system helps you track customers, control deals, and automate routine tasks.
We build CRMs tailored to your needs — from small businesses to complex solutions for medium and large companies.
Our goal is to create a system that genuinely improves team efficiency and accelerates sales growth.$$,
  features = ARRAY['Business process analysis','CRM architecture design','Development and integrations','Analytics and reporting setup','Testing and launch','Support and scaling'],
  advantages = ARRAY['Free consultation','Preliminary process audit','Free 1-month support'],
  faq = jsonb_build_array(
    jsonb_build_object('question','How long does CRM development take?','answer','From 5 to 18 business days, depending on project complexity and number of integrations.'),
    jsonb_build_object('question','What do you need from me to get started?','answer','A description of your processes, a list of desired features, and access to existing services (email, telephony, messengers).'),
    jsonb_build_object('question','Can we extend the system after launch?','answer','Yes, it’s modular. You can add new features as your company grows.'),
    jsonb_build_object('question','Are integrations with services included?','answer','Basic integrations (email, messengers, telephony) are included. Additional ones — upon agreement.'),
    jsonb_build_object('question','Will you provide training and support?','answer','Yes, we train your team and provide one month of free support.')
  ),
  meta_title = $$CRM System for Business | Development and Implementation | Work4Studio$$,
  meta_description = $$We develop CRM systems tailored to your business. Automation, service integrations, improved efficiency and sales growth.$$,
  meta_keywords = $$crm system, crm development, turnkey crm, crm implementation, business automation, crm integration, company crm$$,
  h1_tag = $$Custom CRM Development$$,
  canonical_url = 'https://work4studio.com/services/crm-sistema',
  og_title = $$CRM development and implementation | Work4Studio$$,
  og_description = $$A modern CRM to grow your business. Full setup, integrations, support, and sales acceleration.$$,
  og_image = 'https://work4studio.com/uploads/services/crm-sistema-cover.jpg'
WHERE service_id = '1459bea8-822f-4e65-a97a-ffbeade4b150' AND language = 'en';

INSERT INTO public.service_translations(
  service_id, language, title, short_description, description, features, advantages, faq,
  meta_title, meta_description, meta_keywords, h1_tag, canonical_url, og_title, og_description, og_image
)
SELECT 
  '1459bea8-822f-4e65-a97a-ffbeade4b150','en',
  $$CRM System$$,
  $$Custom CRM to manage customers, sales, and internal processes.$$,
  $$A CRM system helps you track customers, control deals, and automate routine tasks.
We build CRMs tailored to your needs — from small businesses to complex solutions for medium and large companies.
Our goal is to create a system that genuinely improves team efficiency and accelerates sales growth.$$,
  ARRAY['Business process analysis','CRM architecture design','Development and integrations','Analytics and reporting setup','Testing and launch','Support and scaling'],
  ARRAY['Free consultation','Preliminary process audit','Free 1-month support'],
  jsonb_build_array(
    jsonb_build_object('question','How long does CRM development take?','answer','From 5 to 18 business days, depending on project complexity and number of integrations.'),
    jsonb_build_object('question','What do you need from me to get started?','answer','A description of your processes, a list of desired features, and access to existing services (email, telephony, messengers).'),
    jsonb_build_object('question','Can we extend the system after launch?','answer','Yes, it’s modular. You can add new features as your company grows.'),
    jsonb_build_object('question','Are integrations with services included?','answer','Basic integrations (email, messengers, telephony) are included. Additional ones — upon agreement.'),
    jsonb_build_object('question','Will you provide training and support?','answer','Yes, we train your team and provide one month of free support.')
  ),
  $$CRM System for Business | Development and Implementation | Work4Studio$$,
  $$We develop CRM systems tailored to your business. Automation, service integrations, improved efficiency and sales growth.$$,
  $$crm system, crm development, turnkey crm, crm implementation, business automation, crm integration, company crm$$,
  $$Custom CRM Development$$,
  'https://work4studio.com/services/crm-sistema',
  $$CRM development and implementation | Work4Studio$$,
  $$A modern CRM to grow your business. Full setup, integrations, support, and sales acceleration.$$,
  'https://work4studio.com/uploads/services/crm-sistema-cover.jpg'
WHERE NOT EXISTS (
  SELECT 1 FROM public.service_translations t WHERE t.service_id = '1459bea8-822f-4e65-a97a-ffbeade4b150' AND t.language = 'en'
);
