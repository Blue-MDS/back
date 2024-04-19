/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('questions').del();
  // Inserts seed entries
  await knex('questions').insert([
    { id: 1, question_text: 'Tu es du genre : ' },
    { id: 2, question_text: 'Tu aimes : ' },
    { id: 3, question_text: 'Quand tu voyages, tu aimes :' },
    { id: 4, question_text: 'Comment choisirais-tu ton arôme Blue ?'},
    { id: 5, question_text: 'Quelle citation te décrit le mieux ?'},
    { id: 6, question_text: 'Si tu devais décrire le caractère de ton arôme Blue idéal, il serait :'},
  ]);
  
};
