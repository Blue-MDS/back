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
      const fiveMinutesAgo = new Date(new Date().getTime() - (5 * 60 * 1000));
      if (new Date(emailVerificationCode.updated_at) < fiveMinutesAgo) {
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
        console.log('test');
        const user = new User({
          email,
          password,
        });
        const newUser = await user.save();
        delete newUser.password;
        const token = jwt.sign({ email: newUser.email, userId: newUser.id }, 'mysecretToken');
        return res.status(201).json({ message: 'User created!', user: newUser, token: token });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  },

  async getUser(req, res) {
    const { email } = req.credentials;
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User doesn\'t exist' });
      }
      delete user.password;
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });
        }
        if (!result) {
          return res.status(400).json({ message: 'Password incorrect' });
        } else {
          const token = jwt.sign({ email: user.email, userId: user.id }, 'mysecretToken');
          return res.status(200).json({ message: 'User logged !', token: token, user: user });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  
  async updateUser(req, res) {
    const {userId, email } = req.credentials;
    const userExist = await User.findByEmail(email); 
    if (!userExist) {
      return res.status(400).json({ message: 'User doesn\'t exist' });
    }
    const data = Object.entries(req.body).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    try {
      const userUpdated = await User.update(userId, data);
      if (!userUpdated) {
        return res.status(400).json({ message: 'User doesn\'t exist' });
      }
      const user = await User.findByEmail(email);
      return res.status(200).json({ message: 'User updated !', user: user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async deleteUser(req, res) {
    const { email } = req.credentials;
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User doesn\'t exist'});
      }
      await User.delete(email);
      return res.status(200).json({ message: 'User deleted'});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async completeProfile(req, res) {
    const { userId } = req.credentials;
    try {
      const userProfile =  await User.completeProfile(userId);
      console.log(userProfile);
      return res.status(200).json({ isCompleted: true});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async checkProfileComplete(req, res) {
    const { userId } = req.credentials;
    try {
      const result = await User.getProfileComplete(userId);
      if (!result) {
        return res.status(400).json({ message: 'User doesn\'t exist' });
      }
      return res.status(200).json({ isCompleted: result.profile_complete });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async updateUserProfilePicture(req, res) {
    const { userId, email } = req.credentials;
    const userExist = await User.findByEmail(email); 
    if (!userExist) {
      return res.status(400).json({ message: 'User doesn\'t exist' });
    }
    let filePath;
    if (req.file) {
      filePath = req.file.filename;
    } else if (req.body.avatar) {
      console.log(req.body.avatar);
      filePath = `${req.body.avatar}.png`;
    } else {
      return res.status(400).json({ message: 'No image provided' });
    }
    try {
      const userUpdated = await User.update(userId, { profile_picture: filePath });
      if (!userUpdated) {
        return res.status(400).json({ message: 'User doesn\'t exist' });
      }
      const user = await User.findByEmail(email);
      return res.status(200).json({ message: 'User updated !', user: user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }  
  },

};

module.exports = userController;
