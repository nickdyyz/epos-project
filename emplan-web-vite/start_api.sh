#!/bin/bash

# Start the EPOS Plan Generation API
echo "🚨 Starting EPOS Emergency Plan Generation API..."
echo "=================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking required packages..."
python3 -c "import flask, flask_cors" 2>/dev/null || {
    echo "❌ Required packages not found. Installing..."
    pip3 install flask flask-cors
}

# Start the API server
echo "🌐 Starting API server on http://localhost:5000"
echo "📧 Email functionality will be available"
echo "=================================================="

cd "$(dirname "$0")"
python3 plan_generation_api.py 