const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	userinfo(message, args);
}

async function userinfo(message, args) {
	if (args.length === 0) {
		targetId = message.author.id;
	} else {
		targetId = util.checkTarget(args[0]);
		if (isNaN(targetId)) { util.errorReply(message.channel, targetId, main.variables.default_delete); return; }
	}

	if (main.client.users.get(targetId) !== null) {
		let target = main.client.users.get(targetId);

		reply = `\*\*Userinfo Command\*\*\n`
		+ `\n\*\*User:\*\* \`\`${target.tag}\`\` (${target.id}) [UID: ${data.users[targetId].vars.id}]`
		+ `\n\*\*Created:\*\* ${util.timeToHuman((new Date().getTime() - target.createdTimestamp) / 1000)} ago`;

		if (message.guild.member(target) !== null) { reply += `\n\*\*Joined:\*\* ${util.timeToHuman((new Date().getTime() - message.guild.member(target).joinedTimestamp) / 1000)} ago`; }
		if (target.avatarURL !== null) { reply += `\n\*\*Avatar:\*\* ${await util.shortenUrl(target.avatarURL)}`; }

		util.successReply(message.channel, reply, null);
	} else {
		util.errorReply(message.channel, `This Client No Longer Exists In Any Of The Bots Servers!`, main.variables.default_delete);
	}
}
