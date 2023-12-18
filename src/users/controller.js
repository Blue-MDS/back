const bcrypt = require('bcrypt');
const User = require('./model');
const EmailVerification = require('../email_verification/model');
// const transporter = require('../transporter.conf');
const jwt = require('jsonwebtoken');

const userController = {
  async createUser(req, res) {
    const { email, code, password } = req.body;
    const userExists = await User.findByEmail(email);

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'A user with this email already exist' });
    }

    const emailVerificationCode = await EmailVerification.findCode(email, code);
    if (!emailVerificationCode) {
      return res.status(500).json({ message: 'Invalid code' });
    } else {
      const fiveMinutesAgo = new Date(new Date().getTime() - (1 * 60 * 1000));
      if (new Date(emailVerificationCode.created_at) < fiveMinutesAgo) {
        await EmailVerification.delete(email);
        return res.status(410).json({ message: 'Verification code has expired. Please request a new one.' });
      }
      await EmailVerification.delete(email);
    }
    bcrypt.hash(password, 10, async (err, password) => {
      if (err) {
        return console.error(err);
      }
      try {
        const user = new User({
          email,
          password,
        });
        const newUser = await user.save();
        console.log(newUser);
        const token = jwt.sign({ email: newUser.email, userId: newUser.id }, 'mysecretToken');
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
          const token = jwt.sign({ email: user.email, userId: user.id }, 'mysecretToken');
          res.status(200).json({ message: 'User logged !', token: token });
        }
      });
    }
  },
};

module.exports = userController;
