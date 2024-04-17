/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('teams').del();
  // Inserts seed entries
  await knex('teams').insert([
    { name: 'Mirabeau', description: 'Vous aimez les oranges !' },
    { name: 'Vanilla', description: 'Vous aimez la vanille !' },
    { name: 'Fraisette', description: 'Vous aimez les fraises !' },
    { name: 'Menthe', description: 'Vous aimez la menthe !' },
  ]);
  
};
