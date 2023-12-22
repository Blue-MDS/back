const knex = require('../../db/db');

class EmailVerification {

  static async save(email, code) {
    await knex('email_verifications')
      .insert({ email, code });
    return await knex.from('email_verifications').select('email').where('email', email).first();
  }

  static async findByEmail(email) {
    return await knex.from('email_verifications').select('email').where('email', email).first();
  }

  static async findCode(email, code) {
    console.log(email, code);
    return knex.from('email_verifications').select('*').where({email, code}).first();
  }

  static async updateCode(email, code) {
    await knex.from('email_verifications').where('email', email).update({code, updated_at: new Date()});
    return await knex.from('email_verifications').select('email').where('email', email).first();
  }

  static async delete(email) {
    return await knex.from('email_verifications').where('email', email).del();
  }
}

module.exports = EmailVerification;
