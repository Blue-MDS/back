const knex = require('../../db/db');

class User {
  constructor(data) {
    (this.firstName = data.firstName),
    (this.lastName = data.lastName),
    (this.birthDate = data.birthDate),
    (this.email = data.email),
    (this.password = data.password);
    (this.profile_picture = data.profile_picture);
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
    return await knex.from('users').
      select('id', 'last_name', 'first_name', 'password', 'email', 'birth_date', 'weight', 
        'height', 'physical_activity', 'health_issues', 'profile_complete').where('email', this.email).first();
  }

  static async findByEmail(email) {
    return await knex.from('users').
      select('id', 'last_name', 'first_name', 'password', 'email', 'birth_date', 'weight', 
        'height', 'physical_activity', 'health_issues', 'profile_complete', 'profile_picture')
      .where('email', email).first();
  }
  static async update(userId, data) {
    let records;
    if (data.health_issues) {
      const healthIssues = await knex.from('health_issues').select('id').whereIn('health_issue', data.health_issues);
      records = healthIssues.map(health_issue => health_issue.id);
    }
    const updated = await knex.from('users').where('id', userId)
      .update({
        birth_date: data.birthDate, 
        first_name: data.firstName,
        last_name: data.lastName, 
        height: data.height, 
        weight: data.weight, 
        physical_activity: data.physical_activity,
        health_issues: records,
        profile_picture: data.profile_picture,
        updated_at: new Date(),
      });
    return updated > 0;
  }
  static async delete(email) {
    return await knex.from('users').where('email', email).del();
  }

  static async completeProfile(userId) {
    return await knex.from('users').where('id', userId).update({ profile_complete: true });
  }

  static async getProfileComplete(userId) {
    return await knex.from('users').select('profile_complete').where('id', userId).first();
  }
}

module.exports = User;
