FROM node:16-alpine3.16

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

CMD [ "node", "dist/main.js" ]