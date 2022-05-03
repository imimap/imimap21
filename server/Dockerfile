FROM node:gallium-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache chromium && npm install
COPY ./ ./
RUN npm run build-ts
EXPOSE 9000
EXPOSE 9229
ENTRYPOINT ["npm", "run", "watch"]

FROM node:gallium-alpine
WORKDIR /server
COPY --from=build /app/package*.json ./
RUN apk add --no-cache chromium && npm ci --only=production
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/certs/ ./certs/
EXPOSE 9000
ENTRYPOINT ["npm", "run", "serve"]
