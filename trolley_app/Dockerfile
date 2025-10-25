# trolley_app/Dockerfile

# Use a Node.js image for the development environment
FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
# This is done first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the Metro bundler ports
EXPOSE 8081
EXPOSE 19000-19002

# The command to run when the container starts
# --host 0.0.0.0 is critical to expose the server
# from within the container to your host machine.
CMD ["npm", "start", "--", "--host", "0.0.0.0"]