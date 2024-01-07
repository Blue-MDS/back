#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
    echo "Starting in production mode..."
    npm start
else
    echo "Starting in development mode..."
    npm run migrate:latest
    npm run seed:run
    npm start
fi
