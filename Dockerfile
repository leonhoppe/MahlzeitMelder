FROM node:18-slim
EXPOSE 3000
WORKDIR /app

COPY ./server/package*.json ./
COPY ./server/server.js ./
RUN npm ci

COPY /www ./www

ENTRYPOINT ["node", "server.js"]
