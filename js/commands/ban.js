const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	switch (args[0]) {
		case 'perm':
			perm(message, args);
			break;
		case 'temp':
			temp(message, args);
			break;
		default:
			empty(message, args);
	}
}

function perm(message, args) {
	if (args.length < 2) { util.errorReply(message.channel, `Please Specify A User! (Mention/UserID/UID)`, main.variables.default_delete); return; }

	targetId = util.checkTarget(args[1]);
	if (isNaN(targetId)) { util.errorReply(message.channel, targetId, main.variables.default_delete); return; }

	if (args.length > 2) {
		//reason
	}

	if (!util.checkTargetable(message.guild, message.author, main.client.users.get(targetId), true)) { util.errorReply(message.channel, `Target Is Too High For Either You Or The Bot!`, main.variables.default_delete); return; }

	let guildMember = message.guild.member(main.client.users.get(targetId));
	if (!guildMember.bannable) { util.errorReply(message.channel, `Target Is Not Bannable By The Bot!`, main.variables.default_delete); return; }

	guildMember.ban({days: '1'})
	.then((_guildMember) => {
		util.successReply(message.channel, `:wave: Banned ${guildMember.user.tag} (${guildMember.user.id}) Permanently :wave:`, null);
	})
}

function temp(message, args) {
	if (args.length < 2) { util.errorReply(message.channel, `Please Specify A Time Length \`\`[s,m,h,d,w]\`\` - \*\*Example:\*\* \`\`3d30m5s\`\``, main.variables.default_delete); return; }
	if (args.length < 3) { util.errorReply(message.channel, `Please Specify A User! (Mention/UserID/UID)`, main.variables.default_delete); return; }

	targetId = util.checkTarget(args[2]);
	if (isNaN(targetId)) { util.errorReply(message.channel, targetId, main.variables.default_delete); return; }

	timeSeconds = util.checkTime(args[1]);
	if (isNaN(timeSeconds)) { util.errorReply(message.channel, timeSeconds, main.variables.default_delete); return; }

	if (args.length > 3) {
		//reason
	}

	if (!util.checkTargetable(message.guild, message.author, main.client.users.get(targetId), true)) { util.errorReply(message.channel, `Target Is Too High For Either You Or The Bot!`, main.variables.default_delete); return; }

	let guildMember = message.guild.member(main.client.users.get(targetId));
	if (!guildMember.bannable) { util.errorReply(message.channel, `Target Is Not Bannable By The Bot!`, main.variables.default_delete); return; }

	guildMember.ban({days: '1'})
	.then((_guildMember) => {
		util.successReply(message.channel, `:wave: Banned ${guildMember.user.tag} (${guildMember.user.id}) For ${util.timeToHuman(timeSeconds)} :wave:`, null);
	})

	util.addTimedEvent('UNBAN', message.guild.id, 'ALL', targetId, timeSeconds);
}

function empty(message, args) {
	let errorReply = `Below are available sub-commands for \*\*ban\*\*`
	+ `\n\`\`\``;

	for (command in main.commands['ban'].subcommands) {
		errorReply += `${command}, `;
	}

	errorReply += `\`\`\``;
	util.successReply(message.channel, errorReply, null);
}
