FROM node:17

WORKDIR /home/server_node/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN chmod +x ./start.sh

EXPOSE 3001

CMD [ "./start.sh" ]