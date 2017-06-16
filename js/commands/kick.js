const main = require('../../eye.js');

const util = require('../util.js');

module.exports.command = function(message, args) {
	kick(message, args);
}

function kick(message, args) {
	if (args.length < 1) { util.errorReply(message.channel, `Invalid User`, main.variables.default_delete); return; }

	targetId = util.checkTarget(args[0]);
	if (isNaN(targetId)) { util.errorReply(message.channel, targetId, main.variables.default_delete); return; }

	if (args.length > 1) {
		//reason
	}

	if (!util.checkTargetable(message.guild, message.author, main.client.users.get(targetId), true)) { util.errorReply(message.channel, `Target Is Too High For Either You Or The Bot!`, main.variables.default_delete); return; }

	let guildMember = message.guild.member(main.client.users.get(targetId));
	if (!guildMember.kickable) { util.errorReply(message.channel, `Target Is Not Kickable By The Bot!`, main.variables.default_delete); return; }

	guildMember.kick()
	.then((_guildMember) => {
		util.successReply(message.channel, `:wave: Kicked ${guildMember.user.tag} (${guildMember.user.id}) :wave:`, null);
	})
}
