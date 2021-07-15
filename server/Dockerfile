FROM node:fermium AS build
WORKDIR /app
COPY package*.json ./
RUN npm -g config set user root && npm install -g phantomjs-prebuilt && npm install
COPY ./ ./
RUN npm run build-ts
EXPOSE 9000
EXPOSE 9229
ENTRYPOINT ["npm", "run", "watch"]

FROM node:fermium
WORKDIR /server
COPY --from=build /app/package*.json ./
RUN npm -g config set user root && npm install -g phantomjs-prebuilt && npm ci --only=production
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/certs/ ./certs/
EXPOSE 9000
ENTRYPOINT ["npm", "run", "serve"]
