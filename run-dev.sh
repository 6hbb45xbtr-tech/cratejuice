#!/bin/bash

# Run both frontend and backend servers concurrently
echo "Starting CrateJuice Application..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    [[ -n "$BACKEND_PID" ]] && kill $BACKEND_PID 2>/dev/null
    [[ -n "$FRONTEND_PID" ]] && kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend with development environment
cd backend
export FLASK_ENV=development
python3 app.py &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting..."
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
