# Сборка
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json bun.lockb ./
RUN npm install --force
COPY . .
RUN npm run build

# Продакшен сервер
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем кастомный nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
