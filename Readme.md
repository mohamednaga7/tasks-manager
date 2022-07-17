# Tasks Manager - A simple task manager app

## Instructions for use

- if you don't have a postgres db and redis db installed, you can run an instance for each of them in docker by:

  - first changing the values in running `docker compose up -d`

- add your postgresql connection url to api/.env file (DATABASE_URL)
  if you are using docker the url is `postgresql://postgres:postgres@0.0.0.0:5432/tasks-manager-db`
- add your jwt secret to api/.env file (JWT_SECRET)
- add your session secret to api/.env file (SESSION_SECRET)
- add your redis connection url to api/.env file (REDIS_URL)
  if you are using docker the url is `redis://redis:6379`
- add your port to api/.env file (PORT)
- in your terminal run `yarn first-start` to setup everything and start the server
- in your browser go to http://localhost:<PORT> to test the app

### Other commands

- `yarn setup` to setup the frontend and the backend apps
- `yarn deploy:db` to migrate the database and make it ready
- `yarn seed` to deploy the frontend app
- `yarn start` to start the app
