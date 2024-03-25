// mailer.test.js
const nodemailer = require('nodemailer');
const transport = require('../src/transporter.conf');

// Mock nodemailer
jest.mock('../src/transporter.conf', () => ({
  sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
    callback(null, true);
  })
}));

describe('nodemailer', () => {
  it('should send an email with correct parameters', async () => {
    const emailOptions = {
      from: '"Test" <test@example.com>',
      to: 'user@example.com',
      subject: 'Hello ✔',
      text: 'Hello world?',
    };
    await transport.sendMail(emailOptions);
    expect(transport.sendMail).toHaveBeenCalled();
    expect(transport.sendMail).toHaveBeenCalledWith(emailOptions, expect.any(Function));
  });
});
