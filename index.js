const express = require('express');
const cors = require('cors');
const server = express();
const PORT = process.env.PORT;
const userRoute = require('./src/users/route');
const waterRoute = require('./src/water_consumptions/route');
const verifyEmailRoute = require('./src/email_verification/route');
const healthIssueRoute = require('./src/health_issues/route');


server.use(cors());
server.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

server.use(express.json());

server.use('/users', userRoute);
server.use('/water', waterRoute);
server.use('/verifyEmail', verifyEmailRoute);
server.use('/healthIssues', healthIssueRoute);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

