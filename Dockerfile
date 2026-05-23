# Estágio 1: Construir a aplicação React
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN yarn config set network-timeout 1000000 \
    && yarn config set network-concurrency 50
RUN yarn install

COPY . .
RUN yarn build

# Estágio 2: Servir a aplicação com Nginx
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
