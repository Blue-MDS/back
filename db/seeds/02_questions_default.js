/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('questions').del();
  // Inserts seed entries
  await knex('questions').insert([
    { id: 1, question_text: 'Quelle est votre couleur préférée ?' },
    { id: 2, question_text: 'Quel est votre fruit préféré ?' },
    { id: 3, question_text: 'Quel est votre animal préféré ?' },
    { id: 4, question_text: 'Quelle est votre saison préférée ?'}
  ]);
  
};
