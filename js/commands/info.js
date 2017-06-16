const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	info(message, args);
}

function info(message, args) {
	if (args.length === 0) {
		targetId = message.author.id;
	} else {
		targetId = util.checkTarget(args[0]);
		if (isNaN(targetId)) { util.errorReply(message.channel, targetId, main.variables.default_delete); return; }
	}

	if (main.client.users.get(targetId) !== null) {
		reply = `\*\*Info Command\*\*\n`
		+ `\n\*\*Unique ID:\*\* ${data.users[targetId].vars.id}`
		+ `\n\*\*User ID:\*\* ${main.client.users.get(targetId).id}`
		+ `\n\*\*Tag:\*\* \`\`${main.client.users.get(targetId).tag}\`\``;

		util.successReply(message.channel, reply, null);
	} else {
		util.errorReply(message.channel, `This Client No Longer Exists In Any Of The Bots Servers!`, main.variables.default_delete);
	}
}
