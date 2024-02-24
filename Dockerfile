FROM node:18-slim as frontend
WORKDIR /app
COPY . .
RUN npm ci
RUN npm install -g @ionic/cli
RUN ionic build --prod

FROM node:18-slim
EXPOSE 3000
WORKDIR /app

COPY ./package*.json ./
COPY server/server.js ./
RUN npm ci

COPY --from=frontend /app/www ./www

ENTRYPOINT ["npm", "run", "start"]
