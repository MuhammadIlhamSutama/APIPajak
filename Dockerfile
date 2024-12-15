FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Expose port dynamically
ENV PORT=8080
EXPOSE $PORT

# Command to start the application
CMD ["node", "app.js"]
