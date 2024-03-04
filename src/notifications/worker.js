// src/notifications/notificationWorker.js
const notificationQueue = require('./queue');
const { Expo } = require('expo-server-sdk');

// Créer une instance de Expo SDK
let expo = new Expo();

notificationQueue.process(async (job) => {
  console.log(job.data);
  const { pushToken, message } = job.data;
  console.log(`Notification planifiée pour l'utilisateur ${userId} avec le token ${pushToken}: ${message}`);

  // Assurez-vous que les tokens sont valides
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  // Créez le message et envoyez-le
  let messages = [{
    to: pushToken,
    sound: 'default',
    body: message,
    data: { withSome: 'data' }, // Vos données supplémentaires ici
  }];

  // Envoyer les notifications via Expo
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log('Notification tickets', ticketChunk);
      tickets.push(...ticketChunk);
      // Vous pouvez traiter les tickets ici comme vous le souhaitez
    } catch (error) {
      console.error('Error sending push notifications', error);
      throw error; // Le job Bull sera marqué comme échoué
    }
  }
});
