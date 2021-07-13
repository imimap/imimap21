# IMIMAP2

## Develop locally

First copy the ".env.sample" file to a new file ".env" and fill out with the secrets.

Install mevn-cli globally, if not done yet
`npm install -g mevn-cli`

In the root folder run
`mevn dockerize`

Ctrl + C will stop the containers.

Alternatively use
`docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d --build`
In that case, shut down the containers with `docker-compose down`.

Three docker containers with the following NAMES are created:
`imimap21_client_1`, `imimap21_server_1`, `imimap21_db_1` and `imimap21_db-gui_1`. 
Run `docker logs -f NAME` to see the logs for one of the containers.


Inspect database at `mongodb://127.0.0.1:27017` with [mongodb-compass](https://docs.mongodb.com/compass/master/connect/).


Project created with [mevn-cli](https://www.npmjs.com/package/mevn-cli).
Client created with [vue-cli](https://www.npmjs.com/package/@vue/cli).
