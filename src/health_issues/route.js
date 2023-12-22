const express = require('express');
const { getHealthIssues } = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.get('/', checkToken, getHealthIssues);

module.exports = router;
