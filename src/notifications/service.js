const agenda = require('./agendaSetup');
const Notification = require('./model');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

function defineUserNotificationTask(userId) {
  agenda.define(`send_notification_${userId}`, async job => {
    const now = new Date();
    const { expoToken, message, startMinutes, endMinutes } = job.attrs.data;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      console.log(`Sending notification to user ${userId} with token ${expoToken} and message: ${message}`);
      if (!Expo.isExpoPushToken(expoToken)) {
        console.error(`Push token ${expoToken} is not a valid Expo push token for user ${userId}`);
        return;
      }

      const messages = [{
        to: expoToken,
        sound: 'default',
        body: message,
        data: { withSome: 'data' },
      }];

      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(messages);
        console.log(ticketChunk);
      } catch (error) {
        console.error(`Error sending notification to user ${userId}`, error);
      }
    } else {
      console.log(`Current time is outside the scheduled window for user ${userId}. No notification sent.`);
    }
  });
}

async function scheduleOrUpdateNotificationForUser(userId, expoToken, startTime, endTime, frequency, message) {
  const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
  const cronExpression = `*/${frequency} * * * *`;

  const taskName = `send_notification_${userId}`;
  await agenda.cancel({ name: taskName });
  defineUserNotificationTask(userId);
  await agenda.every(cronExpression, taskName, { userId, expoToken, message, startMinutes, endMinutes });
  console.log(`Notification task scheduled for user ${userId} with frequency: ${frequency} minutes.`);
}

async function initializeAllUserTasks() {
  const usersPreferences = await Notification.getNotifications();
  usersPreferences.forEach(userPreference => {
    const { user_id, expo_token, start_time, end_time, frequency } = userPreference;
    const message = 'It\'s time for your notification!';
    scheduleOrUpdateNotificationForUser(user_id, expo_token, start_time, end_time, frequency, message);
  });
  console.log('All user notification tasks initialized.');
}

module.exports = { scheduleOrUpdateNotificationForUser, initializeAllUserTasks };
