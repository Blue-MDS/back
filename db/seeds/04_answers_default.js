/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('answers').del();
  // Inserts seed entries
  await knex('answers').insert([
    { answer_text: 'Bleu', question_id: 1, team_id: 1 },
    { answer_text: 'Vert', question_id: 1, team_id: 2 },
    { answer_text: 'Rouge', question_id: 1, team_id: 3 },
    { answer_text: 'Orange', question_id: 2, team_id: 1 },
    { answer_text: 'Banane', question_id: 2, team_id: 2 },
    { answer_text: 'Fraise', question_id: 2, team_id: 3 },
    { answer_text: 'Chat', question_id: 3, team_id: 1 },
    { answer_text: 'Chien', question_id: 3, team_id: 2 },
    { answer_text: 'Poisson', question_id: 3, team_id: 3 },
    { answer_text: 'Été', question_id: 4, team_id: 1 },
    { answer_text: 'Automne', question_id: 4, team_id: 2 },
    { answer_text: 'Hiver', question_id: 4, team_id: 3 },
  ]);  
};
