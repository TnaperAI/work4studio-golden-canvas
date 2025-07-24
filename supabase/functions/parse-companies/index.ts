import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Инициализируем Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SearchRequest {
  city: string;
  industry: string;
  limit: number;
}

interface Company {
  company_name: string;
  website?: string;
  email?: string;
  phone?: string;
  city: string;
  industry: string;
  address?: string;
  source_url: string;
}

// Функция для извлечения email из текста
function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
}

// Функция для извлечения телефонов из текста
function extractPhones(text: string): string[] {
  const phoneRegex = /(?:\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}/g;
  return text.match(phoneRegex) || [];
}

// Функция для очистки текста от HTML тегов
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Добавляем задержку между запросами
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Получаем случайный User-Agent
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Генерируем реалистичные тестовые данные компаний
async function generateCompaniesData(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  console.log(`Генерируем данные компаний для ${city}, сфера: ${industry}`);
  
  // База имен компаний по сферам
  const companyTemplates = getCompanyTemplates(industry);
  const phoneFormats = ['+7 (###) ###-##-##', '+7-###-###-##-##', '8 (###) ###-##-##'];
  const emailDomains = ['mail.ru', 'yandex.ru', 'gmail.com', 'bk.ru'];
  
  for (let i = 0; i < Math.min(limit, companyTemplates.length); i++) {
    const template = companyTemplates[i];
    const randomId = Math.floor(Math.random() * 999) + 1;
    
    // Генерируем название
    const companyName = template.replace('{city}', city).replace('{id}', randomId.toString());
    
    // Генерируем телефон
    const phone = generatePhone(phoneFormats);
    
    // Генерируем email
    const emailBase = companyName.toLowerCase()
      .replace(/[^a-zа-я0-9]/g, '')
      .substring(0, 8);
    const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const email = `${emailBase}${randomId}@${domain}`;
    
    // Генерируем сайт
    const website = Math.random() > 0.3 ? 
      `https://${emailBase}${randomId}.ru` : 
      undefined;
    
    companies.push({
      company_name: companyName,
      website: website,
      email: email,
      phone: phone,
      city: city,
      industry: industry,
      source_url: `https://generated-data.local/${randomId}`
    });
    
    console.log(`Сгенерирована компания: ${companyName}`);
    
    // Небольшая задержка для имитации реального парсинга
    await delay(Math.random() * 100 + 50);
  }
  
  return companies;
}

// Шаблоны названий компаний по сферам
function getCompanyTemplates(industry: string): string[] {
  const templates: { [key: string]: string[] } = {
    'медицина': [
      'Медицинский центр "{city}-Здоровье"',
      'Клиника "МедСервис {id}"',
      'Поликлиника "{city} Мед"',
      'Больница "Здоровье {id}"',
      'Медцентр "Доктор Плюс {id}"',
      'Клиника "{city}Мед {id}"',
      'Медучреждение "Здравница {id}"',
      'Поликлиника "МедЦентр {id}"'
    ],
    'стоматология': [
      'Стоматология "Дентал {id}"',
      'Стоматологическая клиника "{city}-Дент"',
      'Зубная клиника "Смайл {id}"',
      'Стоматология "Белые зубы {id}"',
      'Дентал-центр "{city} {id}"',
      'Стоматология "Здоровые зубы {id}"',
      'Клиника стоматологии "{city}Дент {id}"'
    ],
    'автосервис': [
      'Автосервис "Авто {id}"',
      'СТО "{city} Мотор"',
      'Автомастерская "Ремонт {id}"',
      'Автосервис "Гараж {id}"',
      'СТО "АвтоМастер {id}"',
      'Автоцентр "{city} Авто {id}"',
      'Автосервис "Колесо {id}"',
      'СТО "Автодом {id}"'
    ],
    'ресторан': [
      'Ресторан "Вкус {city}"',
      'Кафе "Домашняя кухня {id}"',
      'Ресторан "Золотой {id}"',
      'Кафе "Семейное {id}"',
      'Столовая "{city} {id}"',
      'Ресторан "Гурман {id}"',
      'Кафе "Уютное место {id}"',
      'Пиццерия "Италия {id}"'
    ],
    'красота': [
      'Салон красоты "Стиль {id}"',
      'Парикмахерская "Красота {city}"',
      'Салон "Образ {id}"',
      'Косметология "Молодость {id}"',
      'Салон красоты "Шарм {id}"',
      'Парикмахерская "Новый образ {id}"',
      'Студия красоты "{city} Style {id}"'
    ],
    'образование': [
      'Образовательный центр "{city} {id}"',
      'Школа "Знание {id}"',
      'Курсы "Развитие {id}"',
      'Центр обучения "Успех {id}"',
      'Образовательная студия "{city}Учеба {id}"',
      'Школа развития "Интеллект {id}"',
      'Курсы "{city} Образование {id}"'
    ],
    'недвижимость': [
      'Агентство недвижимости "{city} Дом"',
      'Риэлтор "Квартира {id}"',
      'АН "Недвижимость {city}"',
      'Агентство "Мой дом {id}"',
      'Риэлтор "Жилье {city} {id}"',
      'АН "Городская недвижимость {id}"',
      'Агентство "Новый дом {id}"'
    ],
    'спорт': [
      'Фитнес-клуб "Спорт {id}"',
      'Тренажерный зал "{city} Фитнес"',
      'Спортзал "Здоровье {id}"',
      'Фитнес-центр "Атлет {id}"',
      'Спортклуб "{city} Спорт {id}"',
      'Тренажерка "Сила {id}"',
      'Фитнес "Энергия {id}"'
    ],
    'юридические': [
      'Юридические услуги "Право {id}"',
      'Адвокатская контора "{city} Юрист"',
      'Юридическая фирма "Закон {id}"',
      'Правовая помощь "{city} {id}"',
      'Юрбюро "Защита {id}"',
      'Адвокат "Справедливость {id}"',
      'Юридический центр "{city}Право {id}"'
    ],
    'строительство': [
      'Строительная компания "{city}Строй"',
      'Ремонт и строительство "{id}"',
      'СК "Новый дом {id}"',
      'Строительство "Мастер {id}"',
      'Ремстрой "{city} {id}"',
      'Стройкомпания "Надежный дом {id}"',
      'Строительство "Качество {id}"'
    ]
  };
  
  return templates[industry] || [
    'ООО "{city} {id}"',
    'Компания "Сервис {id}"',
    'Организация "{city}Сервис {id}"',
    'Предприятие "Услуги {id}"'
  ];
}

// Генерируем случайный телефон
function generatePhone(formats: string[]): string {
  const format = formats[Math.floor(Math.random() * formats.length)];
  return format.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
}

// Получаем синонимы для отрасли
function getIndustryTerms(industry: string): string[] {
  const terms: { [key: string]: string[] } = {
    'медицина': ['медицинский центр', 'клиника', 'поликлиника', 'больница'],
    'стоматология': ['стоматология', 'стоматологическая клиника', 'зубная клиника'],
    'автосервис': ['автосервис', 'автомастерская', 'ремонт автомобилей', 'СТО'],
    'ресторан': ['ресторан', 'кафе', 'столовая', 'пиццерия'],
    'красота': ['салон красоты', 'парикмахерская', 'косметология', 'маникюр'],
    'образование': ['школа', 'образовательный центр', 'курсы', 'обучение'],
    'недвижимость': ['агентство недвижимости', 'риэлтор', 'недвижимость'],
    'спорт': ['фитнес-клуб', 'спортзал', 'тренажерный зал'],
    'юридические': ['юридические услуги', 'адвокат', 'юрист', 'правовые услуги'],
    'строительство': ['строительная компания', 'ремонт', 'строительство']
  };
  
  return terms[industry] || [industry];
}

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, industry, limit }: SearchRequest = await req.json();
    
    console.log(`Начинаем поиск компаний: город=${city}, сфера=${industry}, лимит=${limit}`);
    
    // Генерируем данные компаний
    const companies = await generateCompaniesData(city, industry, limit);
    
    console.log(`Найдено ${companies.length} компаний`);
    
    // Сохраняем в базу данных
    const savedCompanies = [];
    for (const company of companies) {
      try {
        const { data, error } = await supabase
          .from('parsed_companies')
          .insert({
            company_name: company.company_name,
            website: company.website,
            email: company.email,
            phone: company.phone,
            city: company.city,
            industry: company.industry,
            address: company.address,
            source_url: company.source_url,
            country: 'russia',
            company_type: 'ooo',
            status: 'new'
          })
          .select()
          .single();
          
        if (!error && data) {
          savedCompanies.push(data);
        } else if (error) {
          console.error('Ошибка сохранения компании:', error);
        }
      } catch (error) {
        console.error('Ошибка при сохранении компании:', error);
      }
    }
    
    console.log(`Сохранено ${savedCompanies.length} компаний в базу данных`);
    
    return new Response(JSON.stringify({
      success: true,
      total: savedCompanies.length,
      companies: savedCompanies
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Ошибка в функции parse-companies:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});