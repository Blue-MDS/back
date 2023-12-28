const knex = require('../../db/db');

class WaterConsumption {
  constructor(data) {
    (this.userId = data.userId),
    (this.date = data.date),
    (this.quantity = data.quantity);
  }
  async save() {
    await knex('water_consumptions').insert({ user_id: this.userId, quantity: this.quantity });
    return await knex.from('water_consumptions').select('*').where('user_id', this.userId);
  }

  static async getTotalConsumption(userId) {
    return await knex.from('water_consumptions').sum('quantity').where('user_id', userId);
  }

  static async getAllConsumption(userId) {
    return await knex.from('water_consumptions').select('quantity').where('user_id', userId);
  }

  static async saveDailyGoal(userId, dailyGoal) {
    await knex('daily_goals').insert({user_id: userId, goal_quantity: dailyGoal});
    return await knex.from('daily_goals').select('*').where('user_id', userId);
  }

  static async updateDailyGoal(userId, newDailyGoal) {
    return await knex.from('daily_goals').where('user_id', userId).update({daily_goal: newDailyGoal});
  }

  static async getDailyGoal(userId) {
    return await knex.from('daily_goals').select('*').where('user_id', userId);
  }

  static async deleteDailyGoal(userId) {
    return await knex.from('daily_goals').where('user_id', userId).del();
  }
}

module.exports = WaterConsumption;
