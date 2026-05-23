FROM alpine:3.18

RUN apk update && apk upgrade && \
    apk add --no-cache \
    ca-certificates \
    nodejs \
    npm \
    yarn \
    nginx

WORKDIR /app
COPY . .

RUN yarn config set network-timeout 1000000 \
    && yarn config set network-concurrency 50
RUN yarn install
RUN yarn run build

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/nginx/html
RUN cp -r dist/* /usr/share/nginx/html/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
