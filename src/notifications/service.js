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
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
  const startParts = notification.start_time.split(':');
  const endParts = notification.end_time.split(':');
  const startTimeMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
  const endTimeMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  const frequencyMilliseconds = notification.frequency * 60000;

  // eslint-disable-next-line max-len
  let offsetMinutes = currentTimeMinutes > startTimeMinutes ? (currentTimeMinutes - startTimeMinutes) % notification.frequency : 0;
  // Calcule le moment de la première notification à envoyer
  let firstNotificationTime = new Date(now.getTime() + offsetMinutes * 60000);
  if (firstNotificationTime.getHours() * 60 + firstNotificationTime.getMinutes() > endTimeMinutes) {
    console.log('Hors de la plage horaire, pas de notification planifiée.');
    return;
  }

  // Planifie les notifications à partir de la première heure calculée jusqu'à l'heure de fin
  while (firstNotificationTime.getHours() * 60 + firstNotificationTime.getMinutes() <= endTimeMinutes) {
    let delay = firstNotificationTime.getTime() - now.getTime();
    await notificationQueue.add({
      userId: notification.user_id,
      pushToken: notification.expo_token,
      message: 'C\'est l\'heure de la pause plaisir !'
    }, { delay: delay });

    // Calcule le moment de la prochaine notification
    firstNotificationTime = new Date(firstNotificationTime.getTime() + frequencyMilliseconds);
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
