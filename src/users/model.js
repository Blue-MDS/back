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
  static async update(email, data) {
    return await knex.from('users').where('email', email).update(data);
  }
}

module.exports = User;
