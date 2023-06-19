# IMIMAP2

## First set up for local development
1. Copy the ".env.sample" file to a new file ".env" and fill out with the secrets.
2. In the root folder `docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d --build`
3. Seed the database by making a GET request to `http://localhost:9000/api/x/seed`
3. To only seed the admin and some test users in the database make a GET request to `http://localhost:9000/api/x/seedUsers`
4. `docker-compose down`

## Develop locally
* To start the app: `docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d --build`
* To stop the app: `docker-compose down`
* To see the logs: `docker logs -f NAME` (`NAME` is one of \[`imimap21_client_1`, `imimap21_server_1`, `imimap21_db_1`, `imimap21_db-gui_1`\])

To test the app manually, open `http://localhost:8080/`.
If you seeded the database: Login with the username "s0100000@htw-berlin.de" or "admin" and the password you chose in `BYPASS_LDAP` in the env file.
Else: Try the user "imimap@htw-berlin.de" with the same password.

Inspect database at `mongodb://127.0.0.1:27017` with [mongodb-compass](https://docs.mongodb.com/compass/master/connect/).
Or log in at `http://localhost:8081` with the credentials ME_USER and ME_PASS in the env file.

Get the Postman collection at https://www.getpostman.com/collections/3406cd53e9316e2cf003.

## Credits
Project created with [mevn-cli](https://www.npmjs.com/package/mevn-cli).
Client created with [vue-cli](https://www.npmjs.com/package/@vue/cli).
