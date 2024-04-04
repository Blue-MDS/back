const express = require('express');
const { savePreferences, getPreferences } = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.post('/savePreferences', checkToken, savePreferences);
router.get('/getPreferences', checkToken, getPreferences);
module.exports = router;
