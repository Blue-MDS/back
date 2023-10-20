const express = require('express');
const cors = require("cors")
const server = express();
const PORT = process.env.PORT
const pool = require('./database')
const userRoute = require('./users/route');

server.use(cors())
server.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

server.use(express.json());

server.use('/users', userRoute)

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

