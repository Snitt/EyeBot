const main = require('../eye.js');

const data = require('./data.js');
const util = require('./util.js');

module.exports.command = function(message) {
	let command, args;

	if (message.channel.type === 'text') {
		if (data.guilds[message.guild.id] !== undefined) {
			if (message.content.toLowerCase().startsWith(data.guilds[message.guild.id].vars.prefix)) {
				if (data.guilds[message.guild.id].ready === false) { util.errorReply(message.channel, `The Bot Is Still Loading This Guilds Data!`, main.variables.default_delete); return; }

				command = message.content.split(/\s+/g)[0];
				command = command.slice(data.guilds[message.guild.id].vars.prefix.length).toLowerCase();

				args = message.content.split(/\s+/g).slice(1);
			} else if (message.content.toLowerCase().startsWith(`<@${main.client.user.id}>`)) {
				if (data.guilds[message.guild.id].ready === false) { util.errorReply(message.channel, `The Bot Is Still Loading This Guilds Data!`, main.variables.default_delete); return; }

				command = message.content.split(/\s+/g)[1];
				args = message.content.split(/\s+/g).slice(2);
			}
		}
	} else {
		command = message.content.split(/\s+/g)[0].toLowerCase();
		args = message.content.split(/\s+/g).slice(1);
	}

	if (main.commands[command] !== undefined) {
		if (main.commands[command].enabled === false) { util.errorReply(message.channel, `This Command Has Not Been Enabled Yet! It Will Be Soon!`, main.variables.default_delete); return; }

		if (main.commands[command].type !== 'ALL' && (message.channel.type !== main.commands[command].type)) { util.errorReply(message.channel, `You Cannot Use The Command \*\*${command}\*\* Here!`, main.variables.default_delete); return; }

		if (main.commands[command].access !== 'ALL' && (!message.member.hasPermission(main.commands[command].access)) && message.author.id !== main.variables.owner) { util.errorReply(message.channel, `You Don't Have The Permission \*\*${main.commands[command].access}\*\* Here!`, main.variables.default_delete); return; }

		if (main.commands[command].subcommands !== undefined && main.commands[command].subcommands[args[0]] !== undefined) {
			if (main.commands[command].subcommands[args[0]].enabled === false) { util.errorReply(message.channel, `This Sub-Command Has Not Been Enabled Yet!`, main.variables.default_delete); return; }

			if (main.commands[command].subcommands[args[0]].access !== 'ALL' && (!message.member.hasPermission(main.commands[command].subcommands[args[0]].access)) && message.author.id !== main.variables.owner) { util.errorReply(message.channel, `You Don't Have The Permission \*\*${main.commands[command].subcommands[args[0]].access}\*\* Here!`, main.variables.default_delete); return; }
		}

		if (message.channel.type === 'text') {
			if (data.guilds[message.guild.id].ready === false) { util.errorReply(message.channel, `This Guild Has Not Been Loaded Yet! Please Wait!`, main.variables.default_delete); return; }
			if (!message.guild.member(main.client.user).hasPermission(main.commands[command].bot_access)) { util.errorReply(message.channel, `The Bot Doesn't Have The Permission \*\*${main.commands[command].bot_access}\*\* Here!`, main.variables.default_delete); return; }
		}

		let file = require(`./commands/${command}.js`);
		file.command(message, args);
	}
}
