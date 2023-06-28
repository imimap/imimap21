FROM node:gallium-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache chromium && npm install
COPY ./ ./
EXPOSE 9000
EXPOSE 9229
#RUN chown -R 1000:1000 "/root/.npm"
ENTRYPOINT ["npm", "run", "watch"]

FROM node:gallium-alpine as build
WORKDIR /build
COPY --from=dev /app/ ./
RUN npm run build-ts

FROM node:gallium-alpine
WORKDIR /server
COPY --from=build /build/package*.json ./
RUN apk add --no-cache chromium && npm ci --only=production
COPY --from=build /build/dist/ ./dist/
COPY --from=build /build/certs/ ./certs/
COPY --from=dev /app/pdf-templates ./pdf-templates
EXPOSE 9000
ENTRYPOINT ["npm", "run", "serve"]
