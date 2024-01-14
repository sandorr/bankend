#!/bin/zsh

source .env.development
export DATABASE_PORT
export DATABASE_PASSWORD
export PROJECT_NAME
docker compose -f docker/docker-compose.yml -p $PROJECT_NAME $@
