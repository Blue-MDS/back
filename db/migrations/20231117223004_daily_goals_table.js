/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('daily_goals', (table) => {
    table.increments('id').primary();
    table.datetime('date').defaultTo(knex.fn.now()).notNullable();
    table.decimal('goal_quantity', 5, 2).notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTableIfExists('daily_goals');
};
