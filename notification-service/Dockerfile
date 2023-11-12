FROM node:18.18.2

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

CMD [ "node", "dist/main.js" ]