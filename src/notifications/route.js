const express = require('express');
const { savePreferences } = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.post('/savePreferences', checkToken, savePreferences);
module.exports = router;
