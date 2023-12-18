const express = require('express');
const { requestEmailVerificationCode } = require('./controller');
const router = express.Router();

router.post('/', requestEmailVerificationCode);

module.exports = router;
