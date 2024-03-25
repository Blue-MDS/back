/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_answers', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('answer_id').unsigned().notNullable();
    table.boolean('quiz_complete').defaultTo(false);
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('answer_id').references('id').inTable('answers').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTableIfExists('user_answers');
};
