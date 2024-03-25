/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_answers').del();
  // Inserts seed entries
  await knex('user_answers').insert([
    { user_id: 49, answer_id: 1 },
    { user_id: 49, answer_id: 5 },
    { user_id: 49, answer_id: 8 },
    { user_id: 49, answer_id: 11 },
  ]);
  
};
