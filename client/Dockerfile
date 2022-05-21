FROM node:gallium-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN apk add git && npm install
COPY ./ ./
EXPOSE 8080
ENTRYPOINT ["npm", "run", "serve"]

FROM node:gallium-alpine as build
WORKDIR /build
COPY --from=dev /app/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /build/dist /var/www/html/
COPY ./nginx/dev.conf /etc/nginx/sites-enabled/
COPY ./nginx/nginx.conf /etc/nginx/
