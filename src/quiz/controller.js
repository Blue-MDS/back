const {Question, Answer, Team, UserAnswer, TeamUser } = require('./model');

const quizController = {
  async createQuestion(req, res) {
    try {
      const question = new Question(req.body);
      const data = await question.save();
      res.status(201).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async createAnswer(req, res) {
    try {
      const answer = new Answer(req.body);
      const data = await answer.save();
      res.status(201).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async createTeam(req, res) {
    try {
      const team = new Team(req.body);
      const data = await team.save();
      res.status(201).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async createTeamUser(req, res) {
    try {
      const teamUser = new TeamUser(req.body);
      const data = await teamUser.save();
      res.status(201).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async createUserAnswer(req, res) {
    try {
      const userAnswer = new UserAnswer(req.body);
      const data = await userAnswer.save();
      res.status(201).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async getAllQuestions(req, res) {
    try {
      const data = await Question.getAll();
      res.status(200).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async getAllAnswers(req, res) {
    try {
      const data = await Answer.getAll();
      res.status(200).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async getAllTeams(req, res) {
    try {
      const data = await Team.getAll();
      res.status(200).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async getAllUserAnswers(req, res) {
    try {
      const data = await UserAnswer.getAll();
      res.status(200).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },

  async assignTeamUser(req, res) {
    try {
      const { userId } = req.credentials;
      const userHasTeam = await TeamUser.getUserTeam(userId);
      console.log(userHasTeam);
      if (userHasTeam.length) {
        return res.status(400).json({ message: 'User already has a team' });
      } else {
        const userAnswers = await UserAnswer.getUserAnswers(userId);
        console.log(userAnswers);
        if (userAnswers.length < 4) {
          return res.status(400).json({ message: 'User has not answered all questions' });
        } else {
          const teamCounts = userAnswers.reduce((acc, curr) => {
            acc[curr.team_id] = (acc[curr.team_id] || 0) + 1;
            return acc;
          }, {});
          const mostFrequentTeamId = Object.keys(teamCounts).reduce((a, b) => teamCounts[a] > teamCounts[b] ? a : b);
          const teamUser = new TeamUser({
            teamId: mostFrequentTeamId,
            userId: userId
          });
          const data = await teamUser.save();
          res.status(201).json(data);
        }
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  

  async getUserTeam(req, res) {
    try {
      const { userId } = req.credentials;
      console.log(userId);
      const data = await TeamUser.getUserTeam(userId);
      res.status(200).json(data);
    }
    catch (err) {
      res.status(400).json({error: err});
    }
  },
};
module.exports = quizController;
