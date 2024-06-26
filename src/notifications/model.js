const knex = require('../../db/db');

class Notifications {
  constructor(data) {
    this.userId = data.userId;
    this.endTime = data.endTime;
    this.startTime = data.startTime;
    this.frequency = data.frequency;
    this.lastSend = data.lastSend;
    this.expoToken = data.expoToken;
  }

  static calculateNextSend(startTime, frequency) {
    const now = new Date();
    let nextSend = new Date(startTime);
    nextSend.setSeconds(0);
    while (nextSend <= now) {
      nextSend = new Date(nextSend.getTime() + frequency * 60000);
    }
    return nextSend;
  }

  static getReadyToSendNotifications() {
    const now = new Date();
    return knex('notifications')
      .where('next_send', '<=', now)
      .select('*');
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
      end_time: data.endTime,
      start_time: data.startTime,
      frequency: data.frequency,
      expo_token: data.expoToken,
      last_send: data.lastSend,
    });
  }


  static getNotifications() {
    return knex('notifications').select('*');
  }

  static async updatelastSend(notificationId, lastSend) {
    return knex('notifications')
      .where('id', notificationId)
      .update({
        last_send: lastSend,
      });
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

  static async getPreferences(userId) {
    return knex('notifications')
      .where('user_id', userId)
      .first();
  }
}
module.exports = Notifications;
