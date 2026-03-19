# ============================================================
# Stage 1 — Build
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
COPY . .
RUN npx ng build --configuration=production

# ============================================================
# Stage 2 — Runtime
# ============================================================
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
