/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // create a default user with all necessary information and a daily goal and consuptiom from the last 2 months
  await knex('users').insert({
    email: 'toto8@gmail.com',
    password: '$2b$10$e1t9ZaY7Z4Qy2Z5BQxJyIu5XoXqYi5G6o5oQgT2Y5G0j3yY5Hj6gK',
    firstname: 'toto',
    lastname: 'toto',
    height: 180,
    weight: 80,
    physical_activity: 'sédentaire',
    birthdate: '1990-01-01',
  });
  const userId = await knex.from('users').select('id').where('email', 'toto8@gmail.com' ).first();
  await knex('daily_goals').insert({user_id: userId.id, goal_quantity: 2});
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 1 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 2 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 3 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 4 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 5 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 6 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 7 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 8 });
  await knex('water_consumptions').insert({ user_id: userId.id, quantity: 9 });
  
};
