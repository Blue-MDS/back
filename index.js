const express = require('express');
const cors = require("cors")
const server = express();
const PORT = process.env.PORT
const pool = require('./database')

server.use(cors())
server.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

server.use(express.json());

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

async function testDbConnection() {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT NOW()');
      console.log('Success:', res.rows[0]);
      client.release();
    } catch (err) {
      console.error('Error:', err.stack);
    } finally {
      await pool.end();
    }
  }

  testDbConnection();
