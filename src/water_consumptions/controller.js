const WaterConsumption = require('./model');
const User = require('../users/model');
const calculateDailyGoal = require('./utils');

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
    const { userId } = req.credentials;
    try {
      const waterConsumptions = await WaterConsumption.getTotalConsumption(userId);
      if (waterConsumptions === null || waterConsumptions === undefined) {
        return res.status(200).json({ waterConsumptions: 0 });
      }
      return res.status(200).json({ waterConsumptions });
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
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user) {
        const dailyGoal = calculateDailyGoal(user);
        const dailyGoalRecord = await WaterConsumption.saveDailyGoal(userId, dailyGoal);
        if (!dailyGoalRecord) {
          return res.status(404).json({ message: 'Daily goal not created'});
        }
        console.log(dailyGoalRecord);
        return res.status(201).json({ dailyGoalRecord });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateDailyGoal(req, res) {
    const {userId} = req.credentials;
    const {newDailyGoal} = req.body;
    console.log(req.body);
    try {
      console.log(newDailyGoal);
      const dailyGoalRecord = await WaterConsumption.updateDailyGoal(userId, newDailyGoal);
      if (!dailyGoalRecord) {
        return res.status(404).json({ message: 'L\'objectif de consommation n\'a pas pu etre modifié'});
      }
      return res.status(201).json({ dailyGoalRecord });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDailyGoal(req, res) {
    const {email, userId} = req.credentials;
    console.log(email, userId);
    try {
      const dailyGoalRecord = await WaterConsumption.getDailyGoal(userId);
      if (!dailyGoalRecord.length) {
        const user = await User.findByEmail(email);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const dailyGoal = calculateDailyGoal(user);
        const dailyGoalRecord = await WaterConsumption.saveDailyGoal(userId, dailyGoal);
        if (!dailyGoalRecord) {
          return res.status(500).json({ message: 'Failed to create daily goal' });
        }
        return res.status(201).json(dailyGoalRecord);
      }
      return res.status(200).json(dailyGoalRecord);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getDailyConsumption(req, res) {
    const {userId} = req.credentials;
    const {specificDate} = req.query;
    console.log(req.body);
    try {
      const dailyConsumption = await WaterConsumption.getDailyConsumption(userId, specificDate);
      if (!dailyConsumption) {
        return res.status(404).json({ message: 'Aucune consommation pour cette date'});
      }
      console.log(dailyConsumption);
      return res.status(200).json(dailyConsumption);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getWeeklyConsumption(req, res) {
    const {userId} = req.credentials;
    console.log(req.query);
    const {startDate, endDate} = req.query;
    console.log(startDate, endDate);
    try {
      const weeklyConsumption = await WaterConsumption.getWeeklyConsumption(userId, startDate, endDate);
      console.log(weeklyConsumption);
      if (!weeklyConsumption) {
        return res.status(404).json({ message: 'Aucune consommation pour cette semaine'});
      }
      return res.status(200).json(weeklyConsumption);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMonthlyConsumption(req, res) {
    const {userId} = req.credentials;
    console.log(req.query);
    const {specificMonth, specificYear} = req.query;
    console.log(specificMonth, specificYear);
    try {
      const monthlyConsumption = await WaterConsumption.getMonthlyConsumption(userId, specificMonth, specificYear);
      console.log(monthlyConsumption);
      if (!monthlyConsumption) {
        return res.status(404).json({ message: 'Aucune consommation pour ce mois'});
      }
      return res.status(200).json(monthlyConsumption);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = WaterConsumptionController;
