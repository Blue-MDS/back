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
    const query = knex('users')
      .insert({
        first_name: this.firstName,
        last_name: this.lastName,
        birth_date: this.birthDate,
        email: this.email,
        password: this.password,
      })
      .returning('*');
    return query[0];
  }

  static async findByEmail(email) {
    return knex('users').where('email', email).first();
  }
}

module.exports = User;
