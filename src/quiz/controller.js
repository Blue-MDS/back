const {Question, Answer, Team, UserAnswer, TeamUser } = require('./model');
const knex = require('../../db/db');

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
    console.log(req.body);
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

  async getAnswersByQuestionId(req, res) {
    console.log('ca passe dans la fonction');
    try {
      console.log('ca passe');
      const questionId = req.params.questionId;
      console.log(questionId);
      const answers = await Answer.getAnswersByQuestionId(questionId);
      res.json(answers);
    } catch (error) {
      res.status(400).json({error: error.message});
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
      console.log('userId', userId);
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
          await teamUser.save();
          const userTeam = await TeamUser.getUserTeam(userId);
          res.status(201).json(userTeam);
        }
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  

  async getUserTeam(req, res) {
    try {
      const { userId } = req.credentials;
      const data = await TeamUser.getUserTeam(userId);
      if (data.length) {
        res.status(200).json({ hasTeam: true, team: data });
      }
      else {
        res.status(200).json({ hasTeam: false, message: 'User has no team' });
      }
    }
    catch (err) {
      res.status(500).json({ error: 'An unexpected error occurred', details: err });
    }
  },

  async getUserQuizState(req, res) {
    try {
      const { userId } = req.credentials;
      const userAnswers = await UserAnswer.getUserAnswers(userId);
      if (userAnswers.length) {
        res.status(200).json({ state: 'incomplet', answers: userAnswers,});
      } else {
        res.status(200).json({ state: 'new' });
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },

  async submitAnswers(req, res) {
    const { userId, answers } = req.body;
    if (answers.length !== 4) {
      console.log(answers);
      return res.status(400).json({ error: '4 réponses attendues' });
      
    }
    try {
      console.log(userId, answers);
      await knex.transaction(async trx => {
        for (const answerId of answers) {
          const userAnswer = new UserAnswer({ answerId, userId });
          await userAnswer.save(trx);
        }
      });
      res.status(201).json({ message: 'Réponses enregistrées avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des réponses', error);
      res.status(400).json({ error: 'Erreur lors de l\'enregistrement des réponses' });
    }
  },
};
module.exports = quizController;
