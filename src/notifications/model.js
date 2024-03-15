const knex = require('../../db/db');

class Notifications {
  constructor(data) {
    this.userId = data.userId;
    this.endTime = data.endTime;
    this.startTime = data.startTime;
    this.frequency = data.frequency;
    this.expoToken = data.expoToken;
  }

  async saveOrUpdate() {
    const exists = await knex('notifications').where('user_id', this.userId).first();
    if (exists) {
      return Notifications.update(this.userId, {
        endTime: this.endTime,
        startTime: this.startTime,
        frequency: this.frequency,
        expoToken: this.expoToken,
      });
    } else {
      return knex('notifications').insert({
        user_id: this.userId,
        end_time: this.endTime,
        start_time: this.startTime,
        frequency: this.frequency,
        expo_token: this.expoToken,
      });
    }
  }

  static update(userId, data) {
    return knex('notifications').where('user_id', userId).update({
      end_time: data.endTime, // s'attend à un format HH:MM:SS
      start_time: data.startTime, // s'attend à un format HH:MM:SS
      frequency: data.frequency,
      expo_token: data.expoToken,
      // Assurez-vous que last_send et next_send sont gérés correctement si utilisés
    });
  }

  static getNotifications() {
    return knex('notifications').select('*');
  }  

  static async updateLastSend(notificationId) {
    console.log('update', new Date());
    return knex('notifications')
      .where('id', notificationId)
      .update({
        last_send: knex.raw('CURRENT_TIMESTAMP'),
        next_send: knex.raw('CURRENT_TIMESTAMP + (frequency || \' minutes\')::interval')
      });
  }
}
module.exports = Notifications;
