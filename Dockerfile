# Use full Node 20 image (better for development)
FROM node:20

# Install build tools for native modules (safe in dev)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

  # Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "start:dev"]
