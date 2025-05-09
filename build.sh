#!/bin/bash

# Install frontend dependencies and build
cd frontend
npm install
npm run build

# Move back to root
cd ..

# Collect static files
python manage.py collectstatic --noinput
