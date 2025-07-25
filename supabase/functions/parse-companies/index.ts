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

// Реальный веб-скрапинг компаний
async function scrapeRealCompanies(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  console.log(`Начинаем скрапинг компаний: ${city}, ${industry}, лимит: ${limit}`);
  
  try {
    // Поиск через Yandex Maps API
    const yandexCompanies = await scrapeYandexMaps(city, industry, limit);
    companies.push(...yandexCompanies);
    
    if (companies.length < limit) {
      // Дополнительный поиск через DaData если мало результатов
      const dadataCompanies = await scrapeDaData(city, industry, limit - companies.length);
      companies.push(...dadataCompanies);
    }
    
    console.log(`Найдено ${companies.length} реальных компаний`);
    return companies.slice(0, limit);
    
  } catch (error) {
    console.error('Ошибка скрапинга:', error);
    return [];
  }
}

// Скрапинг через Yandex Maps
async function scrapeYandexMaps(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    // Ищем компании по отрасли в городе
    const query = encodeURIComponent(`${industry} ${city}`);
    const url = `https://search-maps.yandex.ru/v1/?text=${query}&type=biz&lang=ru_RU&results=${limit}`;
    
    console.log(`Поиск в Yandex Maps: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent()
      }
    });
    
    if (!response.ok) {
      throw new Error(`Yandex Maps API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features) {
      for (const feature of data.features.slice(0, limit)) {
        const props = feature.properties;
        const company: Company = {
          company_name: props.name || 'Неизвестная компания',
          phone: props.Phones?.[0]?.number || null,
          email: null,
          website: props.Links?.[0]?.href || null,
          city: city,
          industry: industry,
          address: props.description || null,
          source_url: `https://yandex.ru/maps/org/${props.id || ''}`
        };
        
        companies.push(company);
        console.log(`Найдена компания: ${company.company_name}`);
      }
    }
    
  } catch (error) {
    console.error('Ошибка Yandex Maps:', error);
  }
  
  return companies;
}

// Скрапинг через DaData API
async function scrapeDaData(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    const dadataToken = Deno.env.get('DADATA_API_KEY');
    if (!dadataToken) {
      console.log('DaData API key не найден');
      return companies;
    }
    
    const searchQuery = {
      query: `${industry} ${city}`,
      count: limit
    };
    
    console.log(`Поиск в DaData: ${JSON.stringify(searchQuery)}`);
    
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${dadataToken}`,
        'X-Secret': dadataToken
      },
      body: JSON.stringify(searchQuery)
    });
    
    if (!response.ok) {
      throw new Error(`DaData API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.suggestions) {
      for (const suggestion of data.suggestions.slice(0, limit)) {
        const company: Company = {
          company_name: suggestion.value || 'Неизвестная компания',
          phone: suggestion.data.phones?.[0] || null,
          email: suggestion.data.emails?.[0] || null,
          website: suggestion.data.website || null,
          city: city,
          industry: industry,
          address: suggestion.data.address?.value || null,
          source_url: 'https://dadata.ru/'
        };
        
        companies.push(company);
        console.log(`Найдена компания через DaData: ${company.company_name}`);
      }
    }
    
  } catch (error) {
    console.error('Ошибка DaData:', error);
  }
  
  return companies;
}

// Получаем реалистичные названия предприятий
function getRealisticBusinessNames(industry: string, city: string): string[] {
  const baseNames = getCompanyTemplates(industry);
  const variations = [];
  
  // Создаем вариации названий
  for (let i = 0; i < 50; i++) {
    const template = baseNames[i % baseNames.length];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const variation = template
      .replace('{city}', city)
      .replace('{id}', randomNum.toString());
    
    variations.push(variation);
  }
  
  return variations;
}

// Генерируем реалистичный адрес
function generateRealisticAddress(city: string): string {
  const streets = [
    'Ленина', 'Советская', 'Мира', 'Победы', 'Молодежная', 'Центральная',
    'Пушкина', 'Гагарина', 'Комсомольская', 'Первомайская', 'Кирова',
    'Новая', 'Садовая', 'Школьная', 'Рабочая', 'Заводская', 'Парковая'
  ];
  
  const streetTypes = ['ул.', 'пр.', 'пер.', 'б-р'];
  const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const building = Math.floor(Math.random() * 200) + 1;
  const office = Math.random() > 0.7 ? `, оф. ${Math.floor(Math.random() * 50) + 1}` : '';
  
  return `г. ${city}, ${streetType} ${street}, ${building}${office}`;
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

// Получаем координаты города
async function getCityCoords(city: string): Promise<{lat: number, lon: number} | null> {
  try {
    console.log(`Получаем координаты города: ${city}`);
    
    // Используем геокодер Яндекса для получения координат
    const geocodeUrl = `https://geocode-maps.yandex.ru/1.x/?apikey=your-api-key&geocode=${encodeURIComponent(city)}&format=json`;
    
    // Поскольку у нас нет API ключа, возвращаем примерные координаты для популярных городов
    const cityCoords: { [key: string]: {lat: number, lon: number} } = {
      'москва': {lat: 55.7558, lon: 37.6176},
      'санкт-петербург': {lat: 59.9311, lon: 30.3609},
      'новосибирск': {lat: 55.0084, lon: 82.9357},
      'екатеринбург': {lat: 56.8431, lon: 60.6454},
      'казань': {lat: 55.8304, lon: 49.0661},
      'нижний новгород': {lat: 56.2965, lon: 43.9361},
      'челябинск': {lat: 55.1644, lon: 61.4368},
      'самара': {lat: 53.2415, lon: 50.2212},
      'омск': {lat: 54.9885, lon: 73.3242},
      'ростов-на-дону': {lat: 47.2357, lon: 39.7015},
      'уфа': {lat: 54.7388, lon: 55.9721},
      'красноярск': {lat: 56.0184, lon: 92.8672},
      'воронеж': {lat: 51.6720, lon: 39.1843},
      'пермь': {lat: 58.0105, lon: 56.2502},
      'волгоград': {lat: 48.7080, lon: 44.5133}
    };
    
    const normalizedCity = city.toLowerCase().trim();
    const coords = cityCoords[normalizedCity];
    
    if (coords) {
      console.log(`Найдены координаты для ${city}: ${coords.lat}, ${coords.lon}`);
      return coords;
    }
    
    // Если город не найден, возвращаем координаты Москвы как дефолт
    console.log(`Город ${city} не найден, используем координаты Москвы`);
    return cityCoords['москва'];
    
  } catch (error) {
    console.error('Ошибка при получении координат:', error);
    return null;
  }
}

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, industry, limit }: SearchRequest = await req.json();
    
    console.log(`Начинаем поиск компаний: город=${city}, сфера=${industry}, лимит=${limit}`);
    
    // Скрапим реальные компании
    const companies = await scrapeRealCompanies(city, industry, limit);
    
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
            country: 'ru',
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