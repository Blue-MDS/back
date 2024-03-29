// agendaSetup.js
const Agenda = require('agenda');

const mongoConnectionString = 'mongodb://MONGO_USER:MONGO_PASSWORD@mongo:27017/agenda';
const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobs'}});
agenda.on('ready', () => console.log('Agenda connected to MongoDB and ready.'));
agenda.on('start', job => console.log(`Job ${job.attrs.name} started.`));
agenda.on('complete', job => console.log(`Job ${job.attrs.name} completed.`));
agenda.on('success', job => console.log(`Job ${job.attrs.name} succeeded.`));
agenda.on('fail', (err, job) => console.log(`Job ${job.attrs.name} failed with error: ${err}`));
agenda.on('error', (error) => {
  console.log(`Agenda error: ${error}`);
});

module.exports = agenda;
