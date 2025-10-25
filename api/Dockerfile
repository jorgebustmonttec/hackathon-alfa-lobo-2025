# api/Dockerfile
# Use a Node.js image for the development environment
FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
# This is done first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the API port (8080 as defined in index.js)
EXPOSE 8080

# The command to run when the container starts
# We use 'npm run dev' to get --watch for free
CMD ["npm", "run", "dev"]