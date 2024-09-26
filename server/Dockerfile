# Build the server
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack to manage pnpm versions
RUN corepack enable

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN pnpm run build

# Prune unnecessary dependencies specified in devDependencies.
RUN pnpm prune --prod

# Create the production image
FROM node:20-alpine AS production
WORKDIR /app

# Copy built app and pruned node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8000

# Start the server
CMD ["node", "dist/main.js"]
