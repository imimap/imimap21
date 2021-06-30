# IMIMAP2

## Develop locally

In the root folder run
`mevn dockerize`

(you need to install mevn-cli first, `npm install -g mevn-cli`)

Ctrl + C will stop the containers.

Alternatively use
`docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d`

In that case, shut down the containers with docker-compose down.

Three docker containers with the following NAMES are created:
`im2-client`, `im2-db` and `im2-server`.
Run `docker logs -f NAME` to see the logs for one of the containers.


Inspect database at `mongodb://127.0.0.1:27017` with [mongodb-compass](https://docs.mongodb.com/compass/master/connect/).


Project created with [mevn-cli](https://www.npmjs.com/package/mevn-cli).
Client created with [vue-cli](https://www.npmjs.com/package/@vue/cli).
