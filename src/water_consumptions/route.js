const express = require('express');
const { 
  getTotalConsumption, 
  getAllConsumption, 
  recordConsumption, 
  createDailyGoal, 
  getDailyGoal,
  getDailyConsumption,
  getWeeklyConsumption,
  getMonthlyConsumption,
  updateDailyGoal
} = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.post('/record', checkToken, recordConsumption);
router.get('/totalConsumption', checkToken, getTotalConsumption);
router.get('/allConsumption', checkToken, getAllConsumption);
router.get('/saveDailyGoal', checkToken, createDailyGoal);
router.get('/dailyGoal', checkToken, getDailyGoal);
router.get('/dailyConsumption', checkToken, getDailyConsumption);
router.get('/weeklyConsumption', checkToken, getWeeklyConsumption);
router.get('/monthlyConsumption', checkToken, getMonthlyConsumption);
router.put('/updateDailyGoal', checkToken, updateDailyGoal);
module.exports = router;
