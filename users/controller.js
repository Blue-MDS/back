const bcrypt = require('bcrypt');
const User = require('./model');
const transporter = require('../transporter.conf')
// const nodemailer = require('nodemailer'); // pour l'envoi de courriels

const userController = {

  async createUser(req, res) {
    const { firstName, lastName, email, birthDate, password } = req.body;
    const userExists = await User.findByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: "Un utilisateur avec cet e-mail existe déjà" });
    }
    bcrypt.hash(password, 10, async (err, password) => {
      if (err) {
        return console.error(err)
      }
      try {
        const user = new User({ firstName, lastName, email, birthDate, password });
        const newUser = await user.save();
        // TODO : change email template
        const info = await transporter.sendMail({
          from: 'blue@gmail.com',
          to: `${newUser.email}`,
          subject: "Confirmation de votre compte utilisateur",
          text: "Confirmez votre email",
          html: "<b>Confirmez votre email</b>",
        });
        res.status(201).json({ message: 'User created!', user: newUser });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const userExists = await User.findByEmail(email);
    if (userExists) {
      bcrypt.compare(password, userExists.password, (err, result) => {
        if (err) {
          return console.error(err)
        }
        if (!result) {
          return res.status(400).json({ message: "Password incorrect" })
        } else {
          res.status(200).json({ message: "User logged !"})
        }
      })
    }
  }
};

module.exports = userController;
