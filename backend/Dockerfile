# Stage 1: Builder
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
COPY pg-migrate-config.js ./
RUN npm run build  # compiles to /app/build

# Stage 2: Production
FROM node:18 AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Copy compiled files
COPY --from=builder /app/build ./build
# Ensure migrations are copied
COPY --from=builder /app/build/migrations ./build/migrations
COPY pg-migrate-config.js ./

CMD ["npm", "run", "start"]
