const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Définir le mot de passe et le hacher
  const password = 'toto30';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await knex('users').insert({
    id: 49,
    email: 'toto30@gmail.com',
    password: hashedPassword, // Utiliser le mot de passe haché
    first_name: 'toto',
    last_name: 'toto',
    height: 180,
    weight: 80,
    physical_activity: 'sédentaire',
    birth_date: '1990-01-01',
  });
};
