exports.seed = async function (knex) {
  // Supprime toutes les entrées existantes
  await knex('notifications').del();

  // Insère les entrées de seed
  const currentDate = new Date().toISOString().split('T')[0];
  const frequency = 1;


  await knex('notifications').insert([
    {
      start_time: `${currentDate} 08:00:00+00`,
      end_time: `${currentDate} 17:00:00+00`,
      frequency: frequency,
      user_id: 49,
    },
    {
      start_time: `${currentDate} 00:00:00+00`,
      end_time: `${currentDate} 23:59:59+00`,
      frequency: 3,
      user_id: 50,
    },
  ]);
};
