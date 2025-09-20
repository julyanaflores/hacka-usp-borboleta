# Frontend Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else npm i; fi
COPY . .
RUN npm run build || (echo "Falling back to yarn build" && yarn build || true)

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Provide nginx config: proxy /api to backend and SPA fallback
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location /api/ {\n    proxy_pass http://backend:5000/api/;\n    proxy_set_header Host $host;\n  }\n  location / { try_files $uri /index.html; }\n}'>/etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
