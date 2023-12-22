/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.float('height');
    table.float('weight');
    table.enum('physical_activity', ['sédentaire', 'activité légère', 'actif', 'très actif']);
    table.specificType('health_issues', 'INTEGER[]');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumns('height', 'weight', 'physical_activity', 'health_issues');
  });
};
