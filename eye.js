// Normal Dependencies
const discord = require('discord.js');
const sprintf = require('sprintf-js');
const snekfetch = require('snekfetch');
const client = new discord.Client();

// JSON Dependencies
const jCommands = require('./json/commands.json');
const jVariables = require('./json/privatevars.json');

// Exports
module.exports.discord = discord;
module.exports.client = client;
module.exports.sprintf = sprintf;
module.exports.snekfetch = snekfetch;

module.exports.commands = jCommands;
module.exports.variables = jVariables;

// JS Dependencies
const events = require('./js/events.js');

// Error Handling
process.on('unhandledRejection', (error) => {
	console.error(`Uncaught Promise Error: \n${error.stack}`);
});

events.start();
