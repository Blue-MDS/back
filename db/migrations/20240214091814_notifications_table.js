// Mise à jour du fichier de migration (ex. migrations/20210408123456_create_notifications_table.js)
exports.up = function (knex) {
  return knex.schema.createTable('notifications', function (table) {
    table.increments('id').primary();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.integer('frequency').notNullable();
    table.text('expo_token').notNullable();
    table.integer('user_id').unsigned().notNullable().unique();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
