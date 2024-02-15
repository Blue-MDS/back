/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('answers', function(table) {
    table.increments('id').primary();
    table.string('answer_text').notNullable().unique();
    table.integer('question_id').unsigned().notNullable();
    table.integer('team_id').unsigned().notNullable();
    table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE');
    table.foreign('team_id').references('id').inTable('teams').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTableIfExists('answers');
};
