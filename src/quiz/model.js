const knex = require('../../db/db');

class Question {
  constructor(data) {
    this.question_text = data.question;
  }
  async save() {
    await knex('questions').insert({ question_text: this.question_text });
    return await knex.from('questions').select('*').where('question_text', this.question_text);
  }

  static async getAll() {
    return await knex.from('questions').select('*');
  }

  static async delete(questionId) {
    return await knex.from('questions').where('id', questionId).del();
  }

  static async update(questionId, data) {
    await knex.from('questions').where('id', questionId).update({ question_text: data.question });
    return await knex.from('questions').select('*').where('id', questionId);
  }
}

class Answer {
  constructor(data) {
    this.answer_text = data.answer;
    this.question_id = data.questionId;
    this.team_id = data.teamId;
  }

  async save() {
    await knex('answers').
      insert({ answer_text: this.answer_text, question_id: this.question_id, team_id: this.team_id });
    return await knex.from('answers').select('*').where('answer_text', this.answer_text);
  }

  static async getAll() {
    return await knex.from('answers').select('*');
  }

  static async delete(answerId) {
    return await knex.from('answers').where('id', answerId).del();
  }

  static async update(answerId, data) {
    await knex.from('answers').where('id', answerId).update({ answer_text: data.answer });
    return await knex.from('answers').select('*').where('id', answerId);
  }

  static async getAnswersByQuestionId(questionId) {
    return await knex.from('answers').select('*').where('question_id', questionId);
  }
}

class Team {
  constructor(data) {
    this.team_name = data.teamName;
  }

  async save(trx) {
    await knex('user_answers')
      .transacting(trx)
      .insert({ answer_id: this.answer_id, user_id: this.user_id });
  }

  static async getAll() {
    return await knex.from('teams').select('*');
  }

  static async delete(teamId) {
    return await knex.from('teams').where('id', teamId).del();
  }

  static async update(teamId, data) {
    await knex.from('teams').where('id', teamId).update({ team_name: data.teamName });
    return await knex.from('teams').select('*').where('id', teamId);
  }
}

class UserAnswer {
  constructor(data) {
    this.answer_id = data.answerId;
    this.user_id = data.userId;
  }

  async save() {
    await knex('user_answers').insert({ answer_id: this.answer_id, user_id: this.user_id });
    return await knex.from('user_answers').select('*').where('answer_id', this.answer_id);
  }

  static async getAll() {
    return await knex.from('user_answers').select('*');
  }

  static async delete(userAnswerId) {
    return await knex.from('user_answers').where('id', userAnswerId).del();
  }

  static async update(userAnswerId, data) {
    await knex.from('user_answers').where('id', userAnswerId).
      update({ answer_id: data.answerId, user_id: data.userId });
    return await knex.from('user_answers').select('*').where('id', userAnswerId);
  }

  static async getUserAnswers(userId) {
    return knex('user_answers')
      .join('answers', 'user_answers.answer_id', '=', 'answers.id')
      .select('user_answers.answer_id', 'answers.team_id')
      .where('user_answers.user_id', userId);
  }
  
}

class TeamUser {
  constructor(data) {
    this.team_id = data.teamId;
    this.user_id = data.userId;
  }

  async save() {
    console.log(this.team_id, this.user_id);
    await knex('users_team').insert({ team_id: this.team_id, user_id: this.user_id });
    return await knex.from('users_team').select('*').where('team_id', this.team_id);
  }

  static async getAll() {
    return await knex.from('users_team').select('*');
  }

  static async getUserTeam(userId) {
    return await knex('users_team')
      .join('teams', 'users_team.team_id', '=', 'teams.id')
      .select('users_team.team_id', 'teams.name')
      .where('users_team.user_id', userId);
  }

  static async delete(teamUserId) {
    return await knex.from('users_team').where('id', teamUserId).del();
  }

  static async update(teamUserId, data) {
    await knex.from('users_team').where('id', teamUserId).
      update({ team_id: data.teamId, user_id: data.userId });
    return await knex.from('users_team').select('*').where('id', teamUserId);
  }
}

module.exports = { Question, Answer, Team, UserAnswer, TeamUser };
