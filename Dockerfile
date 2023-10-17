FROM node:17

WORKDIR /home/server_node/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3001

CMD [ "npm", "start" ]