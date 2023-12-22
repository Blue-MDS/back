const crypto = require('crypto');
const EmailVerification = require('./model');
const transporter = require('../transporter.conf');

const emailVerificationController = {
  async requestEmailVerificationCode(req, res) {
    const {email} = req.body;
    console.log(email);
    try {
      const code = crypto.randomInt(1000, 10000).toString();
      const existEmailVerification = await EmailVerification.findByEmail(email);
      if (existEmailVerification) {
        await EmailVerification.updateCode(email, code);
      } else {
        await EmailVerification.save( email, code );
      }
      await sendMail({ email, code });
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

};
const sendMail = async (emailVerification) => {
  await transporter.sendMail({
    from: 'blue@gmail.com',
    to: `${emailVerification.email}`,
    subject: 'Confirmation de votre compte utilisateur',
    text: 'Confirmez votre email',
    html: `${emailVerification.code}`,
  });
};

module.exports = emailVerificationController;
