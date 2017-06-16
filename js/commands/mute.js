const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	switch (args[0]) {
		case 'g':
			g(message, args);
			break;
		case 's':
			s(message, args);
			break;
		default:
			empty(message, args);
	}
}

function g(message, args) {
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
	if (guildMember === null) { util.errorReply(message.channel, `This Target Is Not In This Guild!`, main.variables.default_delete); return; }

	for (guildChannel of message.guild.channels.values()) {
		let userPermissions = guildMember.permissionsIn(guildChannel);

		if (userPermissions.has('SEND_MESSAGES')) {
			util.changePermission(message.guild.id, guildChannel.id, guildMember.id, 'SEND_MESSAGES', false);
			util.addTimedEvent('UNMUTE', message.guild.id, guildChannel.id, targetId, timeSeconds);
		}
	}

	util.successReply(message.channel, `Muted ${guildMember.user.tag} (${guildMember.user.id}) Globally For ${util.timeToHuman(timeSeconds)} :wave:`, null);
}

function s(message, args) {
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
	if (guildMember === null) { util.errorReply(message.channel, `This Target Is Not In This Guild!`, main.variables.default_delete); return; }

	util.changePermission(message.guild.id, message.channel.id, guildMember.id, 'SEND_MESSAGES', false);
	util.addTimedEvent('UNMUTE', message.guild.id, message.channel.id, targetId, timeSeconds);

	util.successReply(message.channel, `Muted ${guildMember.user.tag} (${guildMember.user.id}) Here For ${util.timeToHuman(timeSeconds)} :wave:`, null);
}

function empty(message, args) {
	let errorReply = `Below are available sub-commands for \*\*mute\*\*`
	+ `\n\`\`\``;

	for (command in main.commands['mute'].subcommands) {
		errorReply += `${command}, `;
	}

	errorReply += `\`\`\``;
	util.successReply(message.channel, errorReply, null);
}
