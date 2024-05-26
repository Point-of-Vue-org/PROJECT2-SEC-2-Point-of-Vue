FROM node:lts-alpine
WORKDIR /app
RUN npm init -y && npm install json-server
COPY ./data/ ./data/
CMD [ "npx", "json-server", "--watch", "/app/data/db.json", "--port", "5000" ]

EXPOSE 5000