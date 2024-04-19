/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('answers').del();
  // Inserts seed entries
  await knex('answers').insert([
    { answer_text: 'Prudent', question_id: 1, team_id: 1 },
    { answer_text: 'One life', question_id: 1, team_id: 2 },
    { answer_text: 'Être surpris(e)', question_id: 2, team_id: 2 },
    { answer_text: 'Rester sur tes habitudes ', question_id: 2, team_id: 1 },
    { answer_text: 'Que tout soit préparé à l’avance, c’est plus sûr.', question_id: 3, team_id: 1 },
    { answer_text: 'Tout faire à la dernière minute, tu verras bien le reste après. ', question_id: 3, team_id: 2 },
    { answer_text: 'Je choisirais des saveurs que j’ai déjà testé', question_id: 4, team_id: 1 },
    { answer_text: 'Je testerai une nouvelle saveur ', question_id: 4, team_id: 2 },
    { answer_text: '“Toujours à la recherche de nouvelles saveurs.”', question_id: 5, team_id: 2 },
    { answer_text: '“Classique, mais toujours tendance.”', question_id: 5, team_id: 1 },
    { answer_text: 'Frais et parfois piquant', question_id: 6, team_id: 2 },
    { answer_text: 'Acidulé et gourmand à croquer', question_id: 6, team_id: 2 },
    { answer_text: 'Doux avec une note de rondeur ', question_id: 6, team_id: 1 },
    { answer_text: 'Acidulé mais subtil', question_id: 6, team_id: 1 },
  ]);  
};
