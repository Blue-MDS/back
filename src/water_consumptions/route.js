const express = require('express');
const { getTotalConsumption, getAllConsumption, recordConsumption, createDailyGoal } = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.post('/record', checkToken, recordConsumption);
router.get('/totalConsumption', checkToken, getTotalConsumption);
router.get('/allConsumption', checkToken, getAllConsumption);
router.get('/dailyGoal', checkToken, createDailyGoal);

module.exports = router;
