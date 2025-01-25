# client/Dockerfile
FROM node:16-slim

RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
