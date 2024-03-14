const notificationQueue = require('./queue');
const Notification = require('./model');

const isNowInTimeRange = (notification, now) => {
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const start = notification.start_time.split(':');
  const end = notification.end_time.split(':');

  const nowTime = nowHours * 60 + nowMinutes;
  const startTime = parseInt(start[0]) * 60 + parseInt(start[1]);
  const endTime = parseInt(end[0]) * 60 + parseInt(end[1]);

  return nowTime >= startTime && nowTime <= endTime;
};

const scheduleNotificationsForUser = async (notification, now) => {
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const startParts = notification.start_time.split(':');
  const endParts = notification.end_time.split(':');
  const startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
  const endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  const frequencyMilliseconds = notification.frequency * 60000;

  let firstScheduledTime = new Date(now); 
  if (currentTime > startTime) {
    firstScheduledTime.setHours(startParts[0], startParts[1], 0, 0);
    firstScheduledTime = new Date(firstScheduledTime.getTime() + frequencyMilliseconds);
  }

  while (firstScheduledTime.getHours() * 60 + firstScheduledTime.getMinutes() <= endTime) {
    let delay = firstScheduledTime.getTime() - now.getTime();
    await notificationQueue.add({
      userId: notification.user_id,
      pushToken: notification.expo_token,
      message: 'Notification'
    }, { delay: delay });

    firstScheduledTime = new Date(firstScheduledTime.getTime() + frequencyMilliseconds);
  }
};

const scheduleUserNotifications = async () => {
  const notifications = await Notification.getNotifications();
  const now = new Date();

  for (let notification of notifications) {
    if (isNowInTimeRange(notification, now)) {
      await scheduleNotificationsForUser(notification, now);
    }
  }
};

module.exports = {
  scheduleUserNotifications
};
