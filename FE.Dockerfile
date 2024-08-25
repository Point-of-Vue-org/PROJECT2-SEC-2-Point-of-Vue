FROM node:lts-alpine AS build-state
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-state /app/dist/. /usr/share/nginx/html
COPY nginx-config/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]