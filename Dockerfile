# dockerfile with bind mount to sync local dev with docker linux container to enable hot reload

# Stage 1: Builder (General Dependencies)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

# Use full Node 20 image (better for development)
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "start:dev"]

# Stage 3: Production (For final builds, omitted here for brevity)
#