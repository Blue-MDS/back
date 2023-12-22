
const knex = require('../../db/db');
const HealthIssueController = {
  async getHealthIssues(req, res) {
    try {
      const healthIssues = await knex.from('health_issues').select('health_issue');
      if (!healthIssues) {
        return res.status(404).json({message: 'No health issues'});
      }
      return res.status(200).json({ healthIssues: healthIssues });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = HealthIssueController;
