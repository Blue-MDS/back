// controllers/notificationController.js
const Notification = require('./model');
const { scheduleOrUpdateNotificationForUser } = require('./service');
const notificationController = {
  async savePreferences(req, res) {
    const { userId } = req.credentials; // Assurez-vous que l'userId est bien récupéré depuis l'authentification
    const { expoToken, startTime, endTime, frequency } = req.body;

    try {
      const notification = new Notification({
        userId,
        endTime,
        startTime,
        frequency,
        expoToken,
      });
      await notification.saveOrUpdate();

      await scheduleOrUpdateNotificationForUser(userId, expoToken, startTime, endTime, frequency, 
        'C\'est l\'heure de votre nnotification !');

      return res.status(201).json({ message: 'Notification preferences saved and scheduled!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  async getPreferences(req, res) {
    const { userId } = req.credentials;
    try {
      const notification = await Notification.getPreferences(userId);
      if (!notification) {
        return res.status(404).json({ message: 'No notification preferences found' });
      }
      return res.status(200).json(notification);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = notificationController;
