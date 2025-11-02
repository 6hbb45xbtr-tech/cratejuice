#!/bin/bash

# Run backend server
echo "Starting CrateJuice Backend..."
cd backend
export FLASK_ENV=development
python3 app.py
