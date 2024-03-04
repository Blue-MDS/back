// src/notifications/notificationService.js
const notificationQueue = require('./queue');
const knex = require('../../db/db');
const Notification = require('./model');

const scheduleUserNotifications = async () => {
  const notifications = await Notification.getNotifications();
  const now = new Date();

  notifications.forEach(notification => {
    if (isNowInTimeRange(notification, now)) {
      scheduleNotificationsForUser(notification, now);
    }
  });
};

const isNowInTimeRange = (notification, now) => {
  console.log(notification.start_time, notification.end_time, now);
  const startHour = new Date(notification.start_time);
  const endHour = new Date(notification.end_time);
  return now >= startHour && now <= endHour;
};

const scheduleNotificationsForUser = (notification, now) => {
  const endHour = new Date(notification.end_time);
  const frequencyMilliseconds = notification.frequency * 60000;

  for (let scheduledTime = now; scheduledTime < endHour; 
    scheduledTime = new Date(scheduledTime.getTime() + frequencyMilliseconds)) {
    let delay = scheduledTime.getTime() - now.getTime();
    notificationQueue.add({
      userId: notification.user_id,
      pushToken: notification.expo_token,
      // TO CHANGE
      message: 'Notification'
    }, {
      delay: delay
    });
  }
};

module.exports = {
  scheduleUserNotifications
};
