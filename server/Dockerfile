FROM node:fermium AS dev
WORKDIR /app
COPY package*.json ./
RUN npm -g config set user root && npm install -g phantomjs-prebuilt && npm install
COPY ./ ./
EXPOSE 9000
EXPOSE 9229
ENTRYPOINT ["npm", "run", "watch"]

FROM node:fermium as build
WORKDIR /build
COPY --from=dev /app/ ./
RUN npm run build-ts

FROM node:fermium
WORKDIR /server
COPY --from=build /build/package*.json ./
RUN npm -g config set user root && npm install -g phantomjs-prebuilt && npm ci --only=production
COPY --from=build /build/dist/ ./dist/
COPY --from=build /build/certs/ ./certs/
EXPOSE 9000
ENTRYPOINT ["npm", "run", "serve"]
