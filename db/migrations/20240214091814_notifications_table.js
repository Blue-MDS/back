exports.up = function (knex) {
  return knex.schema.createTable('notifications', function (table) {
    table.increments('id').primary();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.integer('frequency').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
