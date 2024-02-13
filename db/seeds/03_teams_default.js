/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('teams').del();
  // Inserts seed entries
  await knex('teams').insert([
    { name: 'Orange', description: 'Vous aimez les oranges !' },
    { name: 'Banane', description: 'Vous aimez les bananes !' },
    { name: 'Fraise', description: 'Vous aimez les fraises !' },
  ]);
  
};
