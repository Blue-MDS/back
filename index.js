const express = require('express');
const cors = require('cors');
const server = express();
const PORT = process.env.PORT;
const userRoute = require('./src/users/route');
const waterRoute = require('./src/water_consumptions/route');
const verifyEmailRoute = require('./src/email_verification/route');
const healthIssueRoute = require('./src/health_issues/route');
const quizRoute = require('./src/quiz/route');
const notificationRoute = require('./src/notifications/route');
const { initializeAllUserTasks } = require('./src/notifications/service');
const agenda = require('./src/notifications/agendaSetup');
const Agendash = require('agendash');

server.use(cors());
server.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

server.use(express.json());

server.use('/users', userRoute);
server.use('/water', waterRoute);
server.use('/verifyEmail', verifyEmailRoute);
server.use('/healthIssues', healthIssueRoute);
server.use('/quiz', quizRoute);
server.use('/notifications', notificationRoute);
server.use('/dash', Agendash(agenda));


server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  try {
    agenda.on('ready', async () => {
      console.log('Agenda connected to MongoDB and ready. toto');
      await initializeAllUserTasks();
    });
    
    agenda.start(); 
    console.log('Notification service started successfully.');
  } catch (err) {
    console.error('Failed to start the notification service:', err);
  }
});
