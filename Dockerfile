FROM node:20-alpine AS builder

WORKDIR /app

# Copy server package.json
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/

WORKDIR /app/server
RUN npm install
RUN npx prisma generate

# Copy client package.json
WORKDIR /app
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

# Build client
COPY client/ ./
RUN npm run build

# Copy server code
WORKDIR /app/server
COPY server/ ./

EXPOSE 5000
CMD ["npm", "start"]
