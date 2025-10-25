# api/Dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Assuming your API's start script is "npm run dev"
CMD ["npm", "run", "dev"]