const Notification = require('./model');

const notificationController = {
  async savePreferences(req, res) {
    const { endTime, startTime, frequency, expoToken } = req.body;
    const { userId } = req.credentials;
    console.log('coucou');
    try {
      const notification = new Notification({
        userId,
        endTime,
        startTime,
        frequency,
        expoToken,
      });
      await notification.saveOrUpdate();
      return res.status(201).json({ message: 'Notification preferences saved!' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
const sendNotifications = async () => {
  console.log('Sending notifications');
  const notificationsToSend = await Notification.getNotificationsToSend();
  for (const notification of notificationsToSend) {
    await Notification.updateLastSend(notification.id);
  }
};

module.exports = notificationController, sendNotifications;
