const agenda = require('./agendaSetup');
const Notification = require('./model');

const { Expo } = require('expo-server-sdk');
let expo = new Expo();

agenda.define('send_notification', async job => {
  const now = new Date();
  const { userId, expoToken, message, startMinutes, endMinutes } = job.attrs.data;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  console.log(nowMinutes, startMinutes, endMinutes);

  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
    console.log(`Sending notification to user ${userId} with token ${expoToken} and message: ${message} at ${now}`);
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


async function scheduleDailyNotifications() {
  const preferences = await Notification.getNotifications();
  
  preferences.forEach(({ user_id, expo_token, start_time, end_time, frequency }) => {
    const startMinutes = parseInt(start_time.split(':')[0]) * 60 + parseInt(start_time.split(':')[1]);
    const endMinutes = parseInt(end_time.split(':')[0]) * 60 + parseInt(end_time.split(':')[1]);
    // eslint-disable-next-line max-len
    console.log(`Scheduling notifications for user ${user_id} with frequency ${frequency} between ${start_time} and ${end_time}`);
    const cronExpression = `*/${frequency} * * * *`;
    console.log(`Cron expression is ${cronExpression}`);
    agenda.every(cronExpression , 'send_notification',{
      userId: user_id,
      expoToken: expo_token,
      message: 'C\'est l\'heure de votre notification !',
      startMinutes,
      endMinutes
    });
  });
}

module.exports = { scheduleDailyNotifications };
