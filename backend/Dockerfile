# Stage 1: Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production && npm install node-pg-migrate

COPY --from=builder /app/build ./build
COPY pg-migrate-config.js ./

EXPOSE 3000
CMD ["sh", "-c", "npm run migrate && node dist/index.js"]
