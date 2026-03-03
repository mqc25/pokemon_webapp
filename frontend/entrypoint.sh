#!/bin/sh

# If package.json doesn't exist, initialize the project
if [ ! -f "package.json" ]; then
    echo "Initializing Vite React app..."
    npm create vite@latest . -- --template react
    
    # Auto-create the Docker-ready vite.config.js
    cat <<EOF > vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: { usePolling: true },
    host: true,
    port: 5173,
    strictPort: true,
  },
})
EOF
fi

# Critical fix: Ensure dependencies are installed if vite is missing
if [ ! -d "node_modules/.bin/vite" ]; then
    echo "Vite not found. Installing dependencies..."
    npm install --legacy-peer-deps
    # Specific libraries for the Pokemon Map & MUI Sidebar
    npm install react-leaflet leaflet axios @mui/material @emotion/react @emotion/styled @mui/icons-material --legacy-peer-deps
fi

echo "Starting Vite server..."
exec npm run dev -- --host