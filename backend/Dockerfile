FROM node:23-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY .env.example .env

EXPOSE 3000
CMD ["node", "src/index.js"]
