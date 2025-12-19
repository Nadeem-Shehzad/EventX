# Base image
FROM node:22-slim

# Set working directory
WORKDIR /app

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

# Copy dependency files first (cache layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose application port
EXPOSE 3000

# Start NestJS in watch mode
CMD ["npm", "run", "start:dev"]