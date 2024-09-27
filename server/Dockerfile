# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Enable corepack to manage pnpm versions
RUN corepack enable

# Copy the entire monorepo
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the server application
WORKDIR /app/server
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable

# Copy package.json and pnpm-lock.yaml from the monorepo root
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy the built server application
COPY --from=build /app/server/dist ./dist

# Copy the shared folder
COPY --from=build /app/shared ./shared

EXPOSE 3000

CMD ["node", "dist/main"]
