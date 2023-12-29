#!/bin/bash

echo "Waiting for PostgreSQL to start..."
while ! nc -z postgres 5432; do   
  sleep 0.1
done
echo "PostgreSQL started"

# Exécution conditionnelle en fonction de l'environnement
if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in production mode..."
    npm start
else
    echo "Starting in development mode..."
    npm run migrate:latest
    npm run seed:run
    npm start
fi
