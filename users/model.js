const pool = require('../database')

class User {
  constructor(data) {
    this.firstName = data.firstName,
    this.lastName = data.lastName,
    this.birthDate = data.birthDate,
    this.email = data.email,
    this.password = data.password
  }

  async save() {
    try {
      const newUserQuery = {
        text: 'INSERT INTO users(first_name, last_name, email, birth_date, password) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [this.firstName, this.lastName, this.email, this.birthDate, this.password],
      };

      const res = await pool.query(newUserQuery);
      return res.rows[0]
    } catch (err) {
      throw new Error(`[Err] User.save: ${err.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };

      const res = await pool.query(query);
      if (res.rows.length > 0) {
        return new User(res.rows[0]);
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`[Err] User.findByEmail: ${err.message}`);
    }
  }

}

module.exports = User;