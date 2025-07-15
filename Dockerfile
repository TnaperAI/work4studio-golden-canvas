# Stage 1: Build the app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json bun.lockb ./
RUN npm install --force

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

FROM nginx:alpine

# Удаляем default конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Создаём директории, как в Ubuntu
RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# Копируем наш виртуальный хост конфиг
COPY myapp.conf /etc/nginx/sites-available/myapp

# Символическая ссылка в sites-enabled
RUN ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

# Копируем собранный frontend
COPY --from=builder /app/dist /var/www/myapp


# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
