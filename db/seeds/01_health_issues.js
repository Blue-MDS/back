/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('health_issues').del();
  await knex('health_issues').insert([
    {id: 1, health_issue: 'fatigue'},
    {id: 2, health_issue: 'acné'},
    {id: 3, health_issue: 'fièvre'},
    {id: 4, health_issue: 'maux de tête'},
    {id: 5, health_issue: 'vertige'},
    {id: 6, health_issue: 'diabète'},
    {id: 7, health_issue: 'constipation'},
    {id: 8, health_issue: 'surpoids'},
    {id: 9, health_issue: 'somnolence'},
  ]);
};
