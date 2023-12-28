# Builder Stage
FROM node:17 AS builder

WORKDIR /home/server_node/app

COPY package*.json ./

RUN npm install

COPY . ./

FROM node:17-alpine

WORKDIR /home/server_node/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /home/server_node/app .

EXPOSE 3001

USER node

CMD [ "./start.sh" ]