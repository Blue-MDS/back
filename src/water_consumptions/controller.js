const WaterConsumption = require('./model');
const User = require('../users/model');

const WaterConsumptionController = {
  async recordConsumption(req, res) {
    const {userId} = req.credentials;
    const {quantity} = req.body;
    try {
      const record = new WaterConsumption({ userId, quantity });
      const newRecord = await record.save();
      return res.status(201).json({ message: 'Recorded', newRecord});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getTotalConsumption(req, res) {
    const {userId} = req.credentials;
    try {
      const waterConsumptions = await WaterConsumption.getTotalConsumption(userId);
      if (!waterConsumptions) {
        return res.status(404).json({message: 'No records'});
      }
      return res.status(200).json({waterConsumptions});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getAllConsumption(req, res) {
    const {userId} = req.credentials;
    try {
      const waterConsumptions = await WaterConsumption.getAllConsumption(userId);
      if (!waterConsumptions) {
        return res.status(404).json({message: 'No records'});
      }
      return res.status(200).json({waterConsumptions});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async createDailyGoal(req, res) {
    const {email, userId} = req.credentials;
    try {
      const user = await User.findByEmail(email);
      if (user) {
        const dailyGoal = calculateDailyGoal(user);
        const dailyGoalRecord = await WaterConsumption.saveDailyGoal(userId, dailyGoal);
        if (!dailyGoalRecord) {
          return res.status(404).json({ message: 'L\'objectif de consommation n\'a pas pu etre crée'});
        }
        return res.status(201).json({ user, dailyGoalRecord });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

const calculateDailyGoal = (user) => {
  let waterBase = user.weight * 30;
  switch (user.physical_activity) {
  case 'sédentaire':
    waterBase += 350;
    break;
  case 'activité légère':
    waterBase += 500;
    break;
  case 'actif':
    waterBase += 750;
    break;
  case 'très actif':
    waterBase += 1000;
    break;
  default:
    break;
  }
  return waterBase / 1000;
};

module.exports = WaterConsumptionController;
