<<<<<<< HEAD
# Stage 1: Build ứng dụng
FROM node:22-alpine AS builder

=======
# Stage 1: Build ứng dụng Vite
FROM node:20.19-alpine AS builder
>>>>>>> 153eab4 (Separate admin and customer access)
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

<<<<<<< HEAD
# Stage 2: Serve với Nginx (hoặc môi trường chạy của bạn)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
=======
# Stage 2: Serve static files
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> 153eab4 (Separate admin and customer access)
