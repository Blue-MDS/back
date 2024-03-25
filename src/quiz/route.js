const express = require('express');
const { assignTeamUser,
  getAllQuestions, 
  getAnswersByQuestionId, 
  createUserAnswer,
  submitAnswers,
  getUserTeam,
} = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.get('/questions', checkToken, getAllQuestions);
router.get('/answers/:questionId', checkToken, getAnswersByQuestionId);
router.post('/submitAnswers', checkToken, submitAnswers);
router.post('/userAnswer', checkToken, createUserAnswer);
router.get('/assignTeamUser', checkToken, assignTeamUser);
router.get('/getUserTeam', checkToken, getUserTeam);


module.exports = router;
