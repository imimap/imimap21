FROM node:fermium-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN apk add git && npm install
COPY ./ ./
RUN npm run build
EXPOSE 8080
ENTRYPOINT ["npm", "run", "serve"]

FROM nginx:alpine
COPY --from=build /app/dist /var/www/html/
COPY ./nginx/dev.conf /etc/nginx/sites-enabled/
COPY ./nginx/nginx.conf /etc/nginx/
