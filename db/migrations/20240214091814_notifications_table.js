exports.up = function (knex) {
  return knex.schema.createTable('notifications', function (table) {
    table.increments('id').primary();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.integer('frequency').notNullable();
    table.text('expo_token').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
