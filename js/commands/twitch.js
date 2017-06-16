const main = require('../../eye.js');

const data = require('../data.js');
const sql = require('../sql.js');
const util = require('../util.js');

const twitchApi = `https://api.twitch.tv/kraken`;

module.exports.command = function(message, args) {
	switch (args[0]) {
		case 'followage':
			followage(message, args);
			break;
		case 'defaultchannel':
			defaultchannel(message, args);
			break;
		case 'info':
			info(message, args);
			break;
		default:
			empty(message, args);
	}
}

function followage(message, args) {
	if (args.length < 2) { util.errorReply(message.channel, `Required User`, main.variables.default_delete); return; }

	if (args.length < 3) {
		if (message.channel.type === 'text') {
			if (data.guilds[message.guild.id].vars.twitch_defaultchannel.length < 1) { util.errorReply(message.channel, `Server Doesn't Have A Default Channel Specified! Please Specifiy A Channel!`, null); return; }
			channel = data.guilds[message.guild.id].vars.twitch_defaultchannel;
		} else {
			util.errorReply(message.channel, `Required Channel`, null);
		}
	} else {
		channel = args[2];
	}

	main.snekfetch.get(`${twitchApi}/users?login=${args[1].toLowerCase()},${channel.toLowerCase()}`)
	.set('Accept', 'application/vnd.twitchtv.v5+json')
	.set('Client-ID', main.variables.twitch_token)
	.then((response) => {
		let body = response.body;
		if (body._total === 0) { util.errorReply(message.channel, `User \`\`${args[1]}\`\` And Channel \`\`${channel}\`\` Does Not Exist!`, main.variables.default_delete); return; }

		if (body._total === 1) {
			if (body.users[0].name === args[1].toLowerCase()) { name = channel; } else { name = args[1]; }
			util.errorReply(message.channel, `User \`\`${name}\`\` Does Not Exist!`, main.variables.default_delete); return;
		}

		main.snekfetch.get(`${twitchApi}/users/${body.users[0]._id}/follows/channels/${body.users[1]._id}`)
		.set('Accept', 'application/vnd.twitchtv.v5+json')
		.set('Client-ID', main.variables.twitch_token)
		.then((_response) => {
			let startTimeStamp = new Date(_response.body.created_at).getTime();
			util.successReply(message.channel, `\`\`${args[1]}\`\` Has Been Following \`\`${channel}\`\` For: \`\`${util.timeToHuman((new Date().getTime() - startTimeStamp) / 1000)}\`\``, null)
		})
		.catch((_response) => {
			util.successReply(message.channel, `User \`\`${args[1]}\`\` Does Not Follow \`\`${channel}\`\`!`, main.variables.default_delete); return;
		})
	})
}

function defaultchannel(message, args) {
	if (args.length < 2) { util.errorReply(message.channel, `Required Channel`, main.variables.default_delete); return; }

	main.snekfetch.get(`${twitchApi}/users?login=${args[1]}`)
	.set('Accept', 'application/vnd.twitchtv.v5+json')
	.set('Client-ID', main.variables.twitch_token)
	.then((response) => {
		let body = response.body;
		if (body._total === 0) { util.errorReply(message.channel, `User \`\`${args[1]}\`\` Does Not Exist!`, main.variables.default_delete); return; }

		sql.query(main.sprintf.vsprintf(sql.updateTwitchChannel, [args[1], data.guilds[message.guild.id].vars.id]))
		.then((results) => {
			data.guilds[message.guild.id].vars.twitch_defaultchannel = args[1];
			util.successReply(message.channel, `Successfully Changed Default Channel To: \`\`${args[1]}\`\``, null);
		})
		.catch((error) => { console.log(error); })
	})
	.catch((response) => {
		util.errorReply(message.channel, `Channel \`\`${args[1]}\`\` Does Not Exist!`, main.variables.default_delete); return;
	})
}

function info(message, args) {
	if (args.length < 2) { util.errorReply(message.channel, `Required User`, main.variables.default_delete); return; }

	main.snekfetch.get(`${twitchApi}/users?login=${args[1]}`)
	.set('Accept', 'application/vnd.twitchtv.v5+json')
	.set('Client-ID', main.variables.twitch_token)
	.then(async (response) => {
		let body = response.body;
		if (body._total === 0) { util.errorReply(message.channel, `Channel \`\`${args[1]}\`\` Does Not Exist!`, main.variables.default_delete); return; }

		let user = body.users[0];
		let startTimeStamp = new Date(user.created_at).getTime();

		reply = `\*\*Twitch Info:\*\*\n`
		+ `\n\*\*Display Name:\*\* \`\`${user.display_name}\`\``
		+ `\n\*\*Created:\*\* ${util.timeToHuman((new Date().getTime() - startTimeStamp) / 1000)} ago`
		+ `\n\*\*Type:\*\* ${user.type} | \*\*ID:\*\* ${user._id}`;

		if (user.bio !== null) { reply += `\n\*\*Bio:\*\* ${user.bio}`; }
		if (user.logo !== null) { reply += `\n\*\*Avatar:\*\* ${await util.shortenUrl(user.logo)}`; }

		util.successReply(message.channel, reply, null);
	})
	.catch((response) => {
		util.errorReply(message.channel, `Channel \`\`${args[1]}\`\` Does Not Exist!`, main.variables.default_delete); return;
	})
}

function empty(message, args) {
	let errorReply = `Below are available sub-commands for \*\*twitch\*\*`
	+ `\n\`\`\``;

	for (command in main.commands['twitch'].subcommands) {
		errorReply += `${command}, `;
	}

	errorReply += `\`\`\``;
	util.successReply(message.channel, errorReply, null);
}
