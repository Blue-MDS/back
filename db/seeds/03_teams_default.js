/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('teams').del();
  // Inserts seed entries
  await knex('teams').insert([
    { name: 'Safe', description: 'Vous aimez les oranges !' },
    { name: 'Curious', description: 'Vous aimez la vanille !' },
  ]);
  
};
