const Notification = require('./model');

const notificationController = {
  async savePreferences(req, res) {
    const { userId, endTime, startTime, frequency, expoToken } = req.body;
    console.log(req.body);
    try {
      const notification = new Notification({
        userId,
        endTime,
        startTime,
        frequency,
        expoToken,
      });
      await notification.save();
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
