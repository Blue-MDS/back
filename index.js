const express = require('express');
const cors = require('cors');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const server = express();
const PORT = process.env.PORT;
const userRoute = require('./src/users/route');
const waterRoute = require('./src/water_consumptions/route');
const verifyEmailRoute = require('./src/email_verification/route');
const healthIssueRoute = require('./src/health_issues/route');
const quizRoute = require('./src/quiz/route');
const notificationRoute = require('./src/notifications/route');
const { scheduleUserNotifications } = require('./src/notifications/service');
const notificationQueue = require('./src/notifications/queue');
require('./src/notifications/worker');

server.use(cors());
server.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const bullBoardAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullAdapter(notificationQueue)],
  serverAdapter: bullBoardAdapter,
});

bullBoardAdapter.setBasePath('/admin/queues');
server.use('/admin/queues', bullBoardAdapter.getRouter());

server.use(express.json());

server.use('/users', userRoute);
server.use('/water', waterRoute);
server.use('/verifyEmail', verifyEmailRoute);
server.use('/healthIssues', healthIssueRoute);
server.use('/quiz', quizRoute);
server.use('/notifications', notificationRoute);


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  scheduleUserNotifications().catch(err => {
    console.error('Erreur lors de la planification des notifications:', err);
  });
});
