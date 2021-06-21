FROM node:fermium-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN apk add git && npm install
COPY ./ ./
RUN npm run build-ts
EXPOSE 9000
ENTRYPOINT ["npm", "run", "watch"]

FROM node:fermium-alpine
WORKDIR /server
COPY --from=build /app/package*.json ./
RUN apk add git && npm ci --only=production
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/certs/ ./certs/
EXPOSE 9000
ENTRYPOINT ["npm", "run", "serve"]
