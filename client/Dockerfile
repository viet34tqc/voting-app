# Build the client
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack to manage pnpm versions
RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the client application
WORKDIR /app/client
RUN pnpm run build

# Serve the client using Nginx
FROM nginx:alpine AS production
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy custom Nginx config if needed
COPY client/nginx.conf /etc/nginx/nginx.conf

# Optimize Nginx for production
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
