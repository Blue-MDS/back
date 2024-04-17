const {Question, Answer, Team, UserAnswer, TeamUser } = require('../src/quiz/model');
const knex = require('../db/db');
const {
  createQuestion,
  createAnswer,
  createTeam,
  createTeamUser, 
  createUserAnswer, 
  getAllQuestions, 
  getAllTeams, 
  getAllAnswers,  
  getAnswersByQuestionId,
  getAllUserAnswers,
  assignTeamUser,
  getUserTeam,
  getUserQuizState,
  submitAnswers} = require('../src/quiz/controller');

jest.mock('../src/quiz/model')
beforeEach(() => {
  jest.clearAllMocks();
});
jest.mock('../db/db', () => ({
  transaction: jest.fn().mockImplementation((callback) => callback()),
}));

describe('createQuestion', () => {
  const req = {
    body: { question: 'Quelle est la capitale de la France ?' }
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should successfully create a question', async () => {
    Question.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue([{ id: 1, question_text: req.body.question }])
    }));
    await createQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, question_text: req.body.question }]);
  });

  it('should return an error if the question cannot be created', async () => {
    Question.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Failed to create question'))
    }));
    await createQuestion(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create question' });
  });
});

describe('createAnswer', () => {
  const req = {
    body: { answer: 'Paris', questionId: 1, teamId: 1 }
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should successfully create an answer', async () => {
    Answer.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue([{ id: 1, answer_text: req.body.answer, question_id: req.body.questionId, team_id: req.body.teamId }])
    }));
    await createAnswer(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, answer_text: req.body.answer, question_id: req.body.questionId, team_id: req.body.teamId }]);
  });

  it('should return an error if the answer cannot be created', async () => {
    Answer.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Failed to create answer'))
    }));
    await createAnswer(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create answer' });
  });
});

describe('createTeam', () => {
  const req = {
    body: { teamName: 'Les Bleus' }
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should successfully create a team', async () => {
    Team.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue([{ id: 1, team_name: req.body.teamName }])
    }));
    await createTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, team_name: req.body.teamName }]);
  });

  it('should return an error if the team cannot be created', async () => {
    Team.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Failed to create team'))
    }));
    await createTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create team' });
  });
});

describe('createTeamUser', () => {
  const req = {
    body: { teamId: 1, userId: 1 }
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should successfully create a team user', async () => {
    TeamUser.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue([{ id: 1, team_id: req.body.teamId, user_id: req.body.userId }])
    }));
    await createTeamUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, team_id: req.body.teamId, user_id: req.body.userId }]);
  });

  it('should return an error if the team user cannot be created', async () => {
    TeamUser.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Failed to create team user'))
    }));
    await createTeamUser(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create team user' });
  });
});

describe('createUserAnswer', () => {
  const req = {
    body: { answerId: 1, userId: 1 }
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should successfully create a user answer', async () => {
    UserAnswer.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue([{ id: 1, answer_id: req.body.answerId, user_id: req.body.userId }])
    }));
    await createUserAnswer(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, answer_id: req.body.answerId, user_id: req.body.userId }]);
  });

  it('should return an error if the user answer cannot be created', async () => {
    UserAnswer.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Failed to create user answer'))
    }));
    await createUserAnswer(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user answer' });
  });
});

describe('getAllQuestions', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return all questions', async () => {
    Question.getAll.mockResolvedValue([{ id: 1, question_text: 'Quelle est la capitale de la France ?' }]);
    await getAllQuestions(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, question_text: 'Quelle est la capitale de la France ?' }]);
  });

  it('should return an error if the questions cannot be retrieved', async () => {
    Question.getAll.mockRejectedValue(new Error('Failed to retrieve questions'));
    await getAllQuestions(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve questions' });
  });
});

describe('getAllTeams', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return all teams', async () => {
    Team.getAll.mockResolvedValue([{ id: 1, team_name: 'Les Bleus' }]);
    await getAllTeams(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, team_name: 'Les Bleus' }]);
  });

  it('should return an error if the teams cannot be retrieved', async () => {
    Team.getAll.mockRejectedValue(new Error('Failed to retrieve teams'));
    await getAllTeams(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve teams' });
  });
});

describe('getAllAnswers', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return all answers', async () => {
    Answer.getAll.mockResolvedValue([{ id: 1, answer_text: 'Paris' }]);
    await getAllAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, answer_text: 'Paris' }]);
  });

  it('should return an error if the answers cannot be retrieved', async () => {
    Answer.getAll.mockRejectedValue(new Error('Failed to retrieve answers'));
    await getAllAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve answers' });
  });
});

describe('getAnswersByQuestionId', () => {
  const req = {
    params: { questionId: 1 }
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return answers by question id', async () => {
    Answer.getAnswersByQuestionId.mockResolvedValue([{ id: 1, answer_text: 'Paris' }]);
    await getAnswersByQuestionId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, answer_text: 'Paris' }]);
  });

  it('should return an error if the answers cannot be retrieved', async () => {
    Answer.getAnswersByQuestionId.mockRejectedValue(new Error('Failed to retrieve answers'));
    await getAnswersByQuestionId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve answers' });
  });
});

describe('getAllUserAnswers', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return all user answers', async () => {
    UserAnswer.getAll.mockResolvedValue([{ id: 1, answer_id: 1, user_id: 1 }]);
    await getAllUserAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, answer_id: 1, user_id: 1 }]);
  });

  it('should return an error if the user answers cannot be retrieved', async () => {
    UserAnswer.getAll.mockRejectedValue(new Error('Failed to retrieve user answers'));
    await getAllUserAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve user answers' });
  });
});

describe('assignTeamUser', () => {
  const req = {
    credentials: { userId: '1' },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return 400 if the user already has a team', async () => {
    TeamUser.getUserTeam.mockResolvedValue([{ team_id: 2, user_id: req.credentials.userId }]);

    await assignTeamUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already has a team' });
  });

  it('should return 400 if the user has not answered all questions', async () => {
    TeamUser.getUserTeam.mockResolvedValue([]);
    UserAnswer.getUserAnswers.mockResolvedValue([{ answer_id: 1 }, { answer_id: 2 }, { answer_id: 3 }]);

    await assignTeamUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User has not answered all questions' });
  });

  it('should assign a team user successfully', async () => {
    TeamUser.getUserTeam.mockResolvedValue([]);
    UserAnswer.getUserAnswers.mockResolvedValue([
      { answer_id: 1, team_id: 1 },
      { answer_id: 2, team_id: 1 },
      { answer_id: 3, team_id: 2 },
      { answer_id: 4, team_id: 1 }
    ]);
    TeamUser.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ team_id: 1, user_id: req.credentials.userId })
    }));

    await assignTeamUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });

  it('should return 500 if an unexpected error occurs', async () => {
    TeamUser.getUserTeam.mockRejectedValue(new Error('Unexpected error'));

    await assignTeamUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unexpected error' });
  });
});

describe('getUserTeam', () => {
  const req = {
    credentials: { userId: '1' },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return the user team successfully', async () => {
    TeamUser.getUserTeam.mockResolvedValue([{ team_id: 1, name: 'Les Bleus' }]);
    await getUserTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      hasTeam: true,
      team: [{ team_id: 1, name: 'Les Bleus' }]
    });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    TeamUser.getUserTeam.mockRejectedValue(new Error('Unexpected error'));
    await getUserTeam(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unexpected error' });
  });
});

describe('getUserQuizState', () => {
  const req = {
    credentials: { userId: '1' },
  };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  it('should return the user quiz state successfully', async () => {
    UserAnswer.getUserAnswers.mockResolvedValue([{ answer_id: 1 }]);
    await getUserQuizState(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.anything());
  });

  it('should return 500 if an unexpected error occurs', async () => {
    UserAnswer.getUserAnswers.mockRejectedValue(new Error('Unexpected error'));
    await getUserQuizState(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unexpected error' });
  });
});

describe('submitAnswers', () => {
  let req, res;

  beforeEach(() => {
    req = {
      credentials: { userId: 1 },
      body: {
        answers: [1, 2, 3, 4]
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    knex.transaction.mockReset();
  });

  it('should return 400 if not enough answers are provided', async () => {
    req.body.answers = [1, 2, 3]; // Moins de 4 réponses
    await submitAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: '4 réponses attendues' });
  });

  it('should return 201 and success message when answers are saved successfully', async () => {
    await submitAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Réponses enregistrées avec succès' });
  });

  it('should return 500 if an error occurs during answer submission', async () => {
    knex.transaction.mockImplementationOnce(() => Promise.reject(new Error('Erreur lors de l\'enregistrement des réponses')));
    await submitAnswers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de l\'enregistrement des réponses' });
  });
});


