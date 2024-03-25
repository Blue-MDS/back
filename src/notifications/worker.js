const notificationQueue = require('./queue');
const { Expo } = require('expo-server-sdk');

let expo = new Expo();

notificationQueue.process(async (job) => {
  console.log(job.data);
  const { pushToken, message, delay  } = job.data;
  console.log(`Notification planifiée pour l'utilisateur avec le token ${pushToken}: ${message} ${delay}`);

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }
  let messages = [{
    to: pushToken,
    sound: 'default',
    body: message,
    data: { withSome: 'data' },
  }];

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Notification tickets', ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notifications', error);
      throw error;
    }
  }
});
