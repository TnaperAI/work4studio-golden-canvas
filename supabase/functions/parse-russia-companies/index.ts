import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface ParsedCompany {
  company_name: string;
  company_type: 'ip' | 'ooo' | 'zao' | 'pao' | 'other';
  registration_number?: string;
  country: 'ru';
  region?: string;
  city?: string;
  address?: string;
  registration_date?: string;
  email?: string;
  website?: string;
  industry?: string;
  source_url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Russian companies parsing...');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Получаем дату для поиска (вчерашний день)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const searchDate = yesterday.toISOString().split('T')[0];
    
    console.log(`Parsing companies registered on: ${searchDate}`);
    
    // Парсим данные из разных источников
    const companies: ParsedCompany[] = [];
    
    // 1. Парсим ЕГРЮЛ (основной источник)
    const egrul_companies = await parseEgrulData(searchDate);
    companies.push(...egrul_companies);
    
    // 2. Парсим дополнительные источники для поиска контактов
    for (const company of companies) {
      if (!company.email || !company.website) {
        const contacts = await findCompanyContacts(company.company_name, company.registration_number);
        if (contacts.email) company.email = contacts.email;
        if (contacts.website) company.website = contacts.website;
      }
    }
    
    // Сохраняем в базу данных
    if (companies.length > 0) {
      const { data, error } = await supabase
        .from('parsed_companies')
        .insert(companies)
        .select();
        
      if (error) {
        console.error('Error saving companies:', error);
        throw error;
      }
      
      console.log(`Successfully saved ${companies.length} companies`);
      
      return new Response(JSON.stringify({
        success: true,
        companies_found: companies.length,
        companies_saved: data?.length || 0,
        date: searchDate,
        sample_companies: companies.slice(0, 3) // первые 3 для отладки
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({
        success: true,
        companies_found: 0,
        message: 'No new companies found for the specified date'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
  } catch (error) {
    console.error('Error in parse-russia-companies:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function parseEgrulData(date: string): Promise<ParsedCompany[]> {
  try {
    console.log('Parsing EGRUL data...');
    
    // Временно добавляем тестовые данные для проверки работоспособности
    console.log('Генерируем тестовые данные...');
    
    const testCompanies: ParsedCompany[] = [
      {
        company_name: 'ООО "Тестовая Компания 1"',
        company_type: 'ooo',
        registration_number: '1234567890123',
        country: 'ru',
        region: 'Московская область',
        city: 'Москва',
        address: 'г. Москва, ул. Тестовая, д. 1',
        registration_date: date,
        industry: 'Разработка программного обеспечения',
        source_url: 'egrul.nalog.ru',
        email: 'test1@example.com',
        website: 'https://example1.com'
      },
      {
        company_name: 'ИП Иванов Иван Иванович',
        company_type: 'ip',
        registration_number: '987654321098',
        country: 'ru',
        region: 'Санкт-Петербург',
        city: 'Санкт-Петербург',
        address: 'г. СПб, пр. Невский, д. 100',
        registration_date: date,
        industry: 'Розничная торговля',
        source_url: 'egrul.nalog.ru'
      },
      {
        company_name: 'ООО "Инновационные Решения"',
        company_type: 'ooo',
        registration_number: '5555666677778',
        country: 'ru',
        region: 'Краснодарский край',
        city: 'Краснодар',
        address: 'г. Краснодар, ул. Красная, д. 50',
        registration_date: date,
        industry: 'Консалтинговые услуги',
        source_url: 'egrul.nalog.ru',
        website: 'https://innovation-solutions.ru'
      }
    ];
    
    console.log(`Generated ${testCompanies.length} test companies`);
    return testCompanies;
    
    // Когда будет готова интеграция с реальным API, раскомментировать:
    /*
    const searchUrl = `https://egrul.nalog.ru/index.html`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch EGRUL: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('Got EGRUL HTML, processing with OpenRouter...');
    
    const companies = await extractCompaniesFromHTML(html, 'egrul.nalog.ru');
    
    return companies;
    */
    
  } catch (error) {
    console.error('Error parsing EGRUL:', error);
    return [];
  }
}

async function extractCompaniesFromHTML(html: string, sourceUrl: string): Promise<ParsedCompany[]> {
  try {
    console.log('Extracting companies data using OpenRouter...');
    
    const prompt = `
Ты эксперт по парсингу данных российских компаний. Проанализируй HTML код и извлеки информацию о новых компаниях.

Нужно найти и извлечь:
- Название компании
- Тип организации (ИП, ООО, ЗАО, ПАО, др.)
- Регистрационный номер (ОГРН/ОГРНИП)
- Дата регистрации
- Адрес
- Регион и город
- Код ОКВЭД (для определения отрасли)

HTML для анализа:
${html.substring(0, 10000)} ... [truncated]

Верни результат ТОЛЬКО в формате JSON массива:
[
  {
    "company_name": "ООО Рога и копыта",
    "company_type": "ooo",
    "registration_number": "1234567890123",
    "registration_date": "2024-01-15",
    "region": "Московская область",
    "city": "Москва", 
    "address": "г. Москва, ул. Ленина, д. 1",
    "industry": "Торговля",
    "okvd": "47.11"
  }
]

Если компании не найдены, верни пустой массив [].
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Work4Studio CRM Parser'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'Ты эксперт по извлечению структурированных данных из HTML. Всегда отвечаешь только валидным JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.log('No content returned from OpenRouter');
      return [];
    }
    
    console.log('OpenRouter response:', content);
    
    // Парсим JSON ответ
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('No JSON array found in response');
      return [];
    }
    
    const companiesData = JSON.parse(jsonMatch[0]);
    
    // Преобразуем в нужный формат
    const companies: ParsedCompany[] = companiesData.map((company: any) => ({
      company_name: company.company_name,
      company_type: mapCompanyType(company.company_type),
      registration_number: company.registration_number,
      country: 'ru' as const,
      region: company.region,
      city: company.city,
      address: company.address,
      registration_date: company.registration_date,
      industry: company.industry,
      source_url: sourceUrl
    }));
    
    console.log(`Extracted ${companies.length} companies from HTML`);
    return companies;
    
  } catch (error) {
    console.error('Error extracting companies from HTML:', error);
    return [];
  }
}

async function findCompanyContacts(companyName: string, registrationNumber?: string): Promise<{email?: string, website?: string}> {
  try {
    console.log(`Searching contacts for: ${companyName}`);
    
    // Поиск через zachestnyibiznes.ru
    const searchQuery = encodeURIComponent(companyName);
    const searchUrl = `https://zachestnyibiznes.ru/search?query=${searchQuery}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.log(`Failed to search contacts: ${response.status}`);
      return {};
    }
    
    const html = await response.text();
    
    // Используем OpenRouter для извлечения контактов
    const contacts = await extractContactsFromHTML(html, companyName);
    
    // Проверяем существование сайта
    if (contacts.website) {
      const siteExists = await checkWebsiteExists(contacts.website);
      if (!siteExists) {
        delete contacts.website;
      }
    }
    
    return contacts;
    
  } catch (error) {
    console.error(`Error finding contacts for ${companyName}:`, error);
    return {};
  }
}

async function extractContactsFromHTML(html: string, companyName: string): Promise<{email?: string, website?: string}> {
  try {
    const prompt = `
Найди контактную информацию для компании "${companyName}" в следующем HTML:

${html.substring(0, 5000)} ... [truncated]

Найди и извлеки:
- Email адрес
- Веб-сайт компании

Верни результат ТОЛЬКО в формате JSON:
{
  "email": "example@company.ru",
  "website": "https://company.ru"
}

Если контакты не найдены, верни пустой объект {}.
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Work4Studio CRM Parser'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'Ты эксперт по поиску контактной информации компаний. Отвечаешь только валидным JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) return {};
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};
    
    return JSON.parse(jsonMatch[0]);
    
  } catch (error) {
    console.error('Error extracting contacts:', error);
    return {};
  }
}

async function checkWebsiteExists(url: string): Promise<boolean> {
  try {
    // Нормализуем URL
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Work4Studio-Bot/1.0)'
      },
      signal: AbortSignal.timeout(10000) // 10 секунд таймаут
    });
    
    return response.ok;
    
  } catch (error) {
    console.log(`Website ${url} does not exist or is not accessible`);
    return false;
  }
}

function mapCompanyType(type: string): 'ip' | 'ooo' | 'zao' | 'pao' | 'other' {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('ип') || lowerType === 'ip') return 'ip';
  if (lowerType.includes('ооо') || lowerType === 'ooo') return 'ooo';
  if (lowerType.includes('зао') || lowerType === 'zao') return 'zao';
  if (lowerType.includes('пао') || lowerType === 'pao') return 'pao';
  
  return 'other';
}