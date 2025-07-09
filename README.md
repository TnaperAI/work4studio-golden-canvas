# Work4Studio - Корпоративный сайт веб-студии

Современный адаптивный сайт веб-студии с административной панелью и полным функционалом управления контентом.

## 🚀 Технологический стек

### Frontend
- **React 18** - современная библиотека для создания пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript для лучшей разработки
- **Vite** - быстрый сборщик и dev-сервер
- **Tailwind CSS** - utility-first CSS фреймворк
- **shadcn/ui** - современные компоненты интерфейса
- **React Router** - маршрутизация
- **React Query** - управление серверным состоянием
- **React Hook Form** - работа с формами
- **Lucide React** - современные иконки

### Backend
- **Supabase** - Backend-as-a-Service платформа
- **PostgreSQL** - реляционная база данных
- **Row Level Security (RLS)** - безопасность на уровне строк
- **Edge Functions** - серверная логика
- **Supabase Auth** - аутентификация пользователей
- **Supabase Storage** - хранение файлов

## 📁 Структура проекта

```
src/
├── components/           # React компоненты
│   ├── ui/              # Базовые UI компоненты (shadcn)
│   ├── admin/           # Компоненты админ-панели
│   ├── Header.tsx       # Шапка сайта
│   ├── Hero.tsx         # Главный баннер
│   ├── Services.tsx     # Секция услуг
│   ├── Cases.tsx        # Секция кейсов
│   └── ...
├── pages/               # Страницы приложения
│   ├── Index.tsx        # Главная страница
│   ├── Services.tsx     # Страница услуг
│   ├── Cases.tsx        # Страница кейсов
│   ├── About.tsx        # О компании
│   ├── Contact.tsx      # Контакты
│   ├── Login.tsx        # Авторизация
│   └── Admin.tsx        # Админ-панель
├── hooks/               # Пользовательские хуки
│   ├── useAuth.ts       # Аутентификация
│   ├── useUserRole.ts   # Роли пользователей
│   └── useSiteContent.ts # Контент сайта
├── integrations/        # Внешние интеграции
│   └── supabase/        # Конфигурация Supabase
├── lib/                 # Утилиты
└── assets/              # Статические ресурсы

supabase/
├── migrations/          # SQL миграции
├── functions/           # Edge Functions
└── config.toml          # Конфигурация Supabase
```

## 🗄️ База данных

### Основные таблицы

#### `site_content`
Динамический контент сайта (заголовки, описания, тексты)
- `section` - раздел сайта
- `key` - ключ контента
- `value` - значение

#### `services`
Услуги компании
- `title`, `description`, `short_description`
- `features` - массив возможностей
- `price_from`, `price_to` - диапазон цен
- `slug` - URL слаг
- SEO поля: `meta_title`, `meta_description`, и т.д.

#### `cases`
Портфолио проектов
- `title`, `description`, `short_description`
- `client_name`, `project_url`
- `category` - категория проекта (enum)
- `technologies` - используемые технологии
- `main_image`, `gallery_images` - изображения
- `results` - результаты проекта
- SEO и сортировка

#### `contact_submissions`
Заявки с формы обратной связи
- `name`, `email`, `phone`, `message`
- `status` - статус обработки

#### `user_roles`
Роли пользователей
- `user_id` - ссылка на auth.users
- `role` - роль (admin/editor)

#### `team_members`
Команда компании
- `name`, `position`, `description`
- `skills` - навыки сотрудника
- `image` - фото сотрудника

#### `page_seo`
SEO настройки страниц
- `page_slug` - URL страницы
- Meta теги, Open Graph, Canonical URL

#### `company_info`
Информация о компании
- `description`, `mission`, `vision`
- `founding_year`, `team_size`
- `projects_completed`, `clients_served`

## 🔐 Система ролей и доступов

### Роли пользователей
- **admin** - полный доступ ко всем функциям
- **editor** - доступ к редактированию контента

### Row Level Security (RLS)
Все таблицы защищены политиками RLS:
- Публичный доступ только к активным записям
- Административные операции требуют соответствующих ролей
- Функция `has_role()` для проверки прав доступа

## 🛠️ Установка и запуск

### Предварительные требования
- Node.js 18+ и npm
- Аккаунт Supabase

### Локальная разработка

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd work4studio
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка Supabase**
- Создайте проект в [Supabase Dashboard](https://supabase.com)
- Получите URL и anon key проекта
- Обновите файл `src/integrations/supabase/client.ts`

4. **Применение миграций**
```bash
# Установка Supabase CLI
npm install -g supabase

# Логин в Supabase
supabase login

# Линк к проекту
supabase link --project-ref <your-project-id>

# Применение миграций
supabase db push
```

5. **Запуск dev-сервера**
```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:8080`

## 🚀 Деплой

### Supabase Edge Functions
```bash
# Деплой всех функций
supabase functions deploy

# Деплой конкретной функции
supabase functions deploy <function-name>
```

### Frontend
Проект можно задеплоить на любой платформе:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 👥 Администрирование

### Создание администратора
```sql
-- Добавить роль admin для пользователя
INSERT INTO user_roles (user_id, role)
VALUES ('<user-uuid>', 'admin');
```

### Доступ к админ-панели
1. Зарегистрируйтесь через `/login`
2. Получите роль admin в базе данных
3. Перейдите на `/admin`

### Функции админ-панели
- **Управление контентом** - редактирование текстов сайта
- **Управление услугами** - добавление/редактирование услуг
- **Управление кейсами** - портфолио проектов
- **Управление командой** - информация о сотрудниках
- **Заявки** - просмотр и обработка обращений
- **SEO настройки** - мета-теги для страниц

## 📧 Настройка почты

Для отправки уведомлений используется Resend:

1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Получите API ключ
3. Добавьте секрет `RESEND_API_KEY` в Supabase
4. Настройте домен для отправки писем

## 🎨 Дизайн-система

### Цветовая палитра
Определена в `src/index.css` с использованием CSS переменных:
- `--primary` - основной цвет бренда
- `--secondary` - вторичный цвет
- `--accent` - акцентный цвет
- `--background` - фон
- `--foreground` - текст

### Компоненты
Используется shadcn/ui с кастомизацией в `components/ui/`

### Респонсивность
Адаптивный дизайн для всех устройств:
- Mobile first подход
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔄 API и хуки

### Основные хуки
- `useAuth()` - аутентификация
- `useUserRole()` - роли пользователей  
- `useSiteContent()` - контент сайта с real-time обновлениями

### Edge Functions
- Обработка форм обратной связи
- Отправка email уведомлений
- Дополнительная бизнес-логика

## 🧪 Тестирование

```bash
# Линтинг
npm run lint

# Типы TypeScript
npm run type-check
```

## 📝 Документация API

### Supabase API
Автоматически генерируется на основе схемы БД в Supabase Dashboard

### Edge Functions
Документация доступна в `supabase/functions/`

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте feature-ветку
3. Внесите изменения
4. Создайте Pull Request

### Соглашения о коде
- ESLint для JavaScript/TypeScript
- Prettier для форматирования
- Conventional Commits для сообщений коммитов

## 📞 Поддержка

При возникновении вопросов:
1. Проверьте документацию
2. Изучите Issues в репозитории
3. Создайте новый Issue с подробным описанием

## 📄 Лицензия

[Укажите лицензию проекта]

---

**Разработано:** Work4Studio  
**Технологии:** React + TypeScript + Supabase  
**Версия:** 1.0.0
