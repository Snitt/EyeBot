const main = require('../../eye.js');

const data = require('../data.js');
const sql = require('../sql.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	switch (args[0]) {
		case 'list':
			list(message, args);
			break;
		case 'add':
			add(message, args);
			break;
		case 'remove':
			remove(message, args);
			break;
		default:
			empty(message, args);
	}
}

function list(message, args) {
	if (data.guilds[message.guild.id].wordfilter.length === 0) {
		util.errorReply(message.channel, `This Guild Has No Word-Filters!`, main.variables.default_delete); return;
	} else {
		reply = `\*\*Word-Filters\*\*\n`
		+ `\`\`\``;

		for (let i = 0; i < data.guilds[message.guild.id].wordfilter.length; i++) {
			reply += `${i}: ${data.guilds[message.guild.id].wordfilter[i].phrase} | `;
		}

		reply += `\`\`\``;
	}

	util.successReply(message.channel, reply, main.variables.default_delete);
}

async function add(message, args) {
	if (args.length < 2) {
		util.errorReply(message.channel, `Couldn't Find A Word/Phrase`, main.variables.default_delete); return;
	} else {
		let wordPhrase = args.slice(1, args.length).join(' ');

		for (let i = 0; i < data.guilds[message.guild.id].wordfilter.length; i++) {
			if (wordPhrase.toLowerCase() === data.guilds[message.guild.id].wordfilter[i].phrase.toLowerCase()) { util.errorReply(message.channel, `This Word Is Already In The Word-Filter!`, main.variables.default_delete); return; }
		}

		await sql.query(main.sprintf.vsprintf(sql.insertWordFilter, [data.guilds[message.guild.id].vars.id, wordPhrase]))
		.then(async (results) => {
			message.delete(0)
			.catch((error) => { console.log(error); })

			data.populateWordFilter(message.guild.id, results.insertId, wordPhrase);
			message.channel.send(`Added \*\*${wordPhrase}\*\* (${data.guilds[message.guild.id].wordfilter.length - 1}) To Word-Filter`)
			.then((msg) => {
				msg.delete(main.variables.default_delete)
				.catch((error) => { console.log(error); })
			})

			let fGuild = await util.fetchMembers(message.guild);
			for (guildMember of fGuild.members.values()) {
				util.checkGuildName(guildMember, fGuild);
			}
		})
		.catch((error) => { console.log(error); })
	}
}

async function remove(message, args) {
	if (args.length < 2) {
		util.errorReply(message.channel, `Please Specifiy A \*\*id\*\* Or \*\*phrase\*\*`, main.variables.default_delete); return;
	} else {
		if (!isNaN(args[1])) {
			if (data.guilds[message.guild.id].wordfilter[args[1]] !== undefined) {
				await sql.query(main.sprintf.vsprintf(sql.removePrefix, [data.guilds[message.guild.id].wordfilter[args[1]].id]))
				.then((results) => {
					message.channel.send(`Removed \*\*${data.guilds[message.guild.id].wordfilter[args[1]].phrase}\*\* (${args[1]}) From The Word-Filter`)
					.then((msg) => {
						msg.delete(main.variables.default_delete)
						.catch((error) => { console.log(error); })
					})

					data.guilds[message.guild.id].wordfilter.splice(args[1], 1);
				})
			} else { util.errorReply(message.channel, `Invalid id`, main.variables.default_delete); return; }
		} else {
			let found = false;
			let wordPhrase = args.slice(1, args.length).join(' ');

			for (let i = 0; i < data.guilds[message.guild.id].wordfilter.length; i++) {
				if (wordPhrase.toLowerCase().replace(/\s+/g, '').includes(data.guilds[message.guild.id].wordfilter[i].phrase.toLowerCase().replace(/\s+/g, ''))) {
					await sql.query(main.sprintf.vsprintf(sql.removePrefix, [data.guilds[message.guild.id].wordfilter[i].id]))
					.then((results) => {
						message.channel.send(`Removed \*\*${data.guilds[message.guild.id].wordfilter[i].phrase}\*\* (${i}) From The Word-Filter`)
						.then((msg) => {
							msg.delete(main.variables.default_delete)
							.catch((error) => { console.log(error); })
						})

						data.guilds[message.guild.id].wordfilter.splice(i, 1);
					})

					found = true;
					break;
				}
			}

			if (!found) { util.errorReply(message.channel, `Couldn't Find This Phrase`, main.variables.default_delete); return; }
		}
	}
}

function empty(message, args) {
	let errorReply = `Below are available sub-commands for \*\*wordfilter\*\*`
	+ `\n\`\`\``;

	for (command in main.commands['wordfilter'].subcommands) {
		errorReply += `${command}, `;
	}

	errorReply += `\`\`\``;
	util.successReply(message.channel, errorReply, null);
}
