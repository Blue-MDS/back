const pool = require('./database')

function runMigration() {
  pool.connect()
    .then(client => {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR (50),
          last_name VARCHAR (50),
          birth_date DATE,
          email VARCHAR (150) UNIQUE NOT NULL,
          password VARCHAR (150) NOT NULL
        )
      `;

      return client.query(query)
        .then(res => {
          console.log('Table created successfully');
          client.release();
        })
        .catch(e => {
          console.error('Error during table creation', e.stack);
          client.release();
        });
    })
    .catch(e => {
      console.error('Error during database connection', e.stack);
    })
    .finally(() => {
      pool.end();
    });
}

runMigration();
