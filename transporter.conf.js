const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.TRANSPORTER_HOST,
  port: process.env.TRANSPORTER_PORT,
  auth: {
    user: process.env.TRANSPORTER_USER,
    pass: process.env.TRANSPORTER_PASSWORD
  }
});

module.exports = transport