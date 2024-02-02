const knex = require('../../db/db');

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

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
    console.log(year, month, day);
    const result = await knex.from('water_consumptions').sum('quantity as total')
      .where('user_id', userId)
      .andWhere(knex.raw('EXTRACT(YEAR FROM date) = ?', [year]))
      .andWhere(knex.raw('EXTRACT(MONTH FROM date) = ?', [month]))
      .andWhere(knex.raw('EXTRACT(DAY FROM date) = ?', [day]));
    return result[0].total;
  }

  static async getAllConsumption(userId) {
    return await knex.from('water_consumptions').select('quantity').where('user_id', userId);
  }

  static async getDailyConsumption(userId, specificDate) {
    return await knex('water_consumptions')
      .where('user_id', userId)
      .andWhere(knex.raw('DATE(date) = ?', [specificDate]))
      .select(knex.raw('EXTRACT(HOUR FROM date) as hour'), knex.raw('SUM(quantity) as total_quantity'))
      .groupByRaw('EXTRACT(HOUR FROM date)')
      .orderBy('hour', 'asc');
  }
  static async getWeeklyConsumption(userId, startDate, endDate) {
    return await knex('water_consumptions')
      .where('user_id', userId)
      .andWhere(knex.raw('DATE(date) BETWEEN ? AND ?', [startDate, endDate]))
      .select(
        knex.raw('DATE(date) as day'),
        knex.raw('SUM(quantity) as total_quantity')
      )
      .groupByRaw('DATE(date)');
  }

  static async getMonthlyConsumption(userId, specificMonth, specificYear) {
    return await knex('water_consumptions')
      .select(
        knex.raw('EXTRACT(DAY FROM date) as day'),
        knex.raw('SUM(quantity) as total_quantity')
      )
      .where('user_id', userId)
      .andWhere(knex.raw('EXTRACT(MONTH FROM date) = ?', [specificMonth]))
      .andWhere(knex.raw('EXTRACT(YEAR FROM date) = ?', [specificYear]))
      .groupByRaw('EXTRACT(DAY FROM date)')
      .orderBy('day', 'asc');
  }

  static async saveDailyGoal(userId, dailyGoal) {
    await knex('daily_goals').insert({user_id: userId, goal_quantity: dailyGoal});
    return await this.getDailyGoal(userId);
  }

  static async updateDailyGoal(userId, newDailyGoal) {
    return await knex.from('daily_goals').where('user_id', userId).update({goal_quantity: newDailyGoal});
  }

  static async getDailyGoal(userId) {
    console.log(date);
    return await knex.from('daily_goals')
      .select('goal_quantity')
      .where('user_id', userId)
      .andWhere(knex.raw('EXTRACT(YEAR FROM date) = ?', [year]))
      .andWhere(knex.raw('EXTRACT(MONTH FROM date) = ?', [month]))
      .andWhere(knex.raw('EXTRACT(DAY FROM date) = ?', [day]));
  }
  
  

  static async deleteDailyGoal(userId) {
    return await knex.from('daily_goals').where('user_id', userId).del();
  }
}

module.exports = WaterConsumption;
