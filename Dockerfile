FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копируем package.json и lock-файлы
COPY package*.json bun.lockb ./

# Установка зависимостей
RUN npm install --force

# Копируем остальной код
COPY . .

# Открываем порт Vite (по умолчанию 5173)
EXPOSE 8080

# Запускаем dev-сервер Vite
CMD ["npm", "run", "dev"]
