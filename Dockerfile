# Use official Node.js 22 slim image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Install ps and other essential tools
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build NestJS (optional for dev)
RUN npm run build

# Expose port
EXPOSE 3000

# Start in watch mode (hot-reload)
CMD ["npm", "run", "start:dev"]