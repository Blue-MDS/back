// src/notifications/notificationQueue.js
const Queue = require('bull');

const notificationQueue = new Queue('notificationQueue', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  }
});

module.exports = notificationQueue;
