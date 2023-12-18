const crypto = require('crypto');
const EmailVerification = require('./model');
const transporter = require('../transporter.conf');

const emailVerificationController = {
  async requestEmailVerificationCode(req, res) {
    const {email} = req.body;
    const emailExist = await EmailVerification.findByEmail(email);
    console.log(emailExist);
    if (emailExist) {
      return res
        .status(400)
        .json({ message: 'A user with this email already exist' });
    }
    const code = crypto.randomInt(100000, 999999).toString();
    try {
      const emailVerification = new EmailVerification({ email, code });
      await emailVerification.save();
      await transporter.sendMail({
        from: 'blue@gmail.com',
        to: `${emailVerification.email}`,
        subject: 'Confirmation de votre compte utilisateur',
        text: 'Confirmez votre email',
        html: `${emailVerification.code}`,
      });
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = emailVerificationController;
