# bankend

## Project setup
Bankend is a Node.js-based API using the Nest framework and a PostgreSQL database running in a Docker container.

It lets you authenticate with a username and password, and then read and update in a limited way bank accounts. It also lets you transfer money to other bank accounts, but currently does not support internal transfers.

A Dockerfile is available for production deployment.

## Commands
```sh
# Install dependencies
yarn
# Start the database in a Docker container
yarn docker:up
# Seed the database with initial data
yarn seed
# Start the application in development mode
yarn start:dev

# Stop and remove the database container
# WARNING: This will delete all data
yarn docker:down
# Stop the database container
yarn docker:stop
```
