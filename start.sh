#!/bin/bash

echo "Waiting PostgreSQL to start..."
while ! nc -z postgres 5432; do   
  sleep 0.1
done
echo "PostgreSQL started"

npm run migrate:latest
npm start
