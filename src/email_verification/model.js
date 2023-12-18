const knex = require('../../db/db');

class EmailVerification {
  constructor(data) {
    (this.email = data.email),
    (this.code = data.code);
  }
  async save() {
    await knex('email_verifications')
      .insert({
        email: this.email,
        code: this.code
      });
    return await knex.from('email_verifications').select('email').where('email', this.email).first();
  }

  static async findByEmail(email) {
    return await knex.from('email_verifications').select('*').where('email', email).first();
  }

  static async findCode(email, code) {
    console.log(email, code);
    return knex.from('email_verifications').select('*').where({email, code}).first();
  }

  static async delete(email) {
    return await knex.from('email_verifications').where('email', email).del();
  }
}

module.exports = EmailVerification;
