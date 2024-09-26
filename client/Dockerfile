# Build the client
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack to manage pnpm versions
RUN corepack enable

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Serve the client using Nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Optimize Nginx for production
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
