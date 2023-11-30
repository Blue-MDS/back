const bcrypt = require('bcrypt');
const User = require('./model');
const transporter = require('../transporter.conf');
const jwt = require('jsonwebtoken');

const userController = {
  async createUser(req, res) {
    const { firstName, lastName, email, birthDate, password } = req.body;
    const userExists = await User.findByEmail(email);

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'A user with this email already exist' });
    }
    bcrypt.hash(password, 10, async (err, password) => {
      if (err) {
        return console.error(err);
      }
      try {
        const user = new User({
          firstName,
          lastName,
          email,
          birthDate,
          password,
        });
        const newUser = await user.save();
        console.log(newUser);
        // TODO : change email template
        const info = await transporter.sendMail({
          from: 'blue@gmail.com',
          to: `${newUser.email}`,
          subject: 'Confirmation de votre compte utilisateur',
          text: 'Confirmez votre email',
          html: '<b>Confirmez votre email</b>',
        });
        const token = jwt.sign({ email: newUser.email }, 'mysecretToken');
        res
          .status(201)
          .json({ message: 'User created!', user: newUser, token: token });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return console.error(err);
        }
        if (!result) {
          return res.status(400).json({ message: 'Password incorrect' });
        } else {
          const token = jwt.sign({ email: user.email }, 'mysecretToken');
          res.status(200).json({ message: 'User logged !', token: token });
        }
      });
    }
  },
};

module.exports = userController;
