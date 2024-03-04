const knex = require('../../db/db');

class Notifications {
  constructor(data) {
    this.userId = data.userId;
    this.endTime = data.endTime;
    this.startTime = data.startTime;
    this.frequency = data.frequency;
    this.lastSend = data.lastSend;
    this.nextSend = data.nextSend;
  }

  async save() {
    await knex('notifications').insert({
      user_id: this.userId,
      end_time: this.endTime,
      start_time: this.startTime,
      frequency: this.frequency,
      last_send: this.lastSend,
      next_send: this.nextSend,
    });
  }

  static update(userId, data) {
    return knex('notifications').where('user_id', userId).update({
      end_time: data.endTime,
      start_time: data.startTime,
      frequency: data.frequency,
      last_send: data.lastSend,
      next_send: data.nextSend,
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
