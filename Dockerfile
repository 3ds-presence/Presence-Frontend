# Stage 1: Build Frontend
FROM docker.io/library/node:22-alpine AS builder
ARG VITE_DISCORD_OAUTH_URL
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx runtime
FROM docker.io/library/nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]