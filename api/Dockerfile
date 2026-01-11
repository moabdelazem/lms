# Stage 1: Build
FROM node:24-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY prisma ./prisma

# Install all dependencies (including dev)
RUN npm ci --ignore-scripts

# Generate Prisma client BEFORE TypeScript build
RUN npx prisma generate

# Copy source and build
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Production dependencies only
FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev --ignore-scripts
RUN npx prisma generate

# Stage 3: Production runtime
FROM node:24-alpine AS production

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy only what's needed
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package.json ./

ENV NODE_ENV=production
USER nodejs

EXPOSE 6767

CMD ["node", "dist/server.js"]