# Builder Stage
FROM node:19.1.0 AS builder

WORKDIR /home/server_node/app

COPY package*.json ./

RUN npm install

COPY . ./

FROM node:19.1.0

WORKDIR /home/server_node/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /home/server_node/app .

EXPOSE 3001

USER node

CMD [ "./start.sh" ]