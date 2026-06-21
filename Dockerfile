FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS development
EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

FROM base AS build
RUN npm run build -- --configuration production

FROM nginx:alpine AS production
COPY --from=build /app/dist/asistencia-portfolio/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
