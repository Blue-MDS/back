const express = require('express');
const { assignTeamUser, getUserTeam } = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.get('/assignTeam', checkToken, assignTeamUser);
router.get('/team', checkToken, getUserTeam);
module.exports = router;
