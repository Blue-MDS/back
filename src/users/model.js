const knex = require('../../db/db');

class User {
  constructor(data) {
    (this.firstName = data.firstName),
    (this.lastName = data.lastName),
    (this.birthDate = data.birthDate),
    (this.email = data.email),
    (this.password = data.password);
  }
  async save() {
    await knex('users')
      .insert({
        first_name: this.firstName,
        last_name: this.lastName,
        birth_date: this.birthDate,
        email: this.email,
        password: this.password,
      });
    console.log(this.email);
    return await knex.from('users').select('id', 'email').where('email', this.email).first();
  }

  static async findByEmail(email) {
    return await knex.from('users').select('*').where('email', email).first();
  }
  static async update(userId, data) {
    let records;
    if (data.health_issues) {
      const healthIssues = await knex.from('health_issues').select('id').whereIn('health_issue', data.health_issues);
      records = healthIssues.map(health_issue => health_issue.id);
    }
    await knex.from('users').where('id', userId)
      .update({
        birth_date: data.birthDate, 
        first_name: data.firstName,
        last_name: data.lastName, 
        height: data.height, 
        weight: data.weight, 
        physical_activity: data.physical_activity,
        health_issues: records,
        updated_at: new Date()
      });
  }
  static async delete(email) {
    return await knex.from('users').where('email', email).del();
  }
}

module.exports = User;
