const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	switch (args[0]) {
		case 'all':
			all(message, args);
			break;
		case 'user':
			user(message, args);
			break;
		default:
			empty(message, args);
	}
}

function all(message, args) {
	if (args.length > 1) {
		if (!isNaN(args[1])) {
			if (args[1] > 1000 || args[1] < 2) { util.errorReply(message.channel, `Invalid Number - Max: 1000 / Min: 2`, main.variables.default_delete); return; }

			deleteLength = args[1];
		} else { util.errorReply(message.channel, `Invalid Number`, main.variables.default_delete); return; }
	} else {
		deleteLength = 100;
	}

	util.bulkDelete(message.channel.id, null, message.id, 0, 0, deleteLength);
}

function user(message, args) {
	if (args.length < 2) { util.errorReply(message.channel, `Please Specify A User! (Mention/UserID/UID)`, main.variables.default_delete); return; }

	targetId = util.checkTarget(args[1]);
	if (isNaN(targetId)) { util.errorReply(message.channel, targetId, main.variables.default_delete); return; }

	if (args.length > 2) {
		if (!isNaN(args[2])) {
			if (args[2] > 100 || args[2] < 2) { util.errorReply(message.channel, `Invalid Number - Max: 100 / Min: 2`, main.variables.default_delete); return; }

			deleteLength = args[2];
		} else { util.errorReply(message.channel, `Invalid Number`, main.variables.default_delete); return; }
	} else {
		deleteLength = 25;
	}

	util.bulkDelete(message.channel.id, targetId, message.id, 0, 0, deleteLength);
}

function empty(message, args) {
	let errorReply = `Below are available sub-commands for \*\*purge\*\*`
	+ `\n\`\`\``;

	for (command in main.commands['purge'].subcommands) {
		errorReply += `${command}, `;
	}

	errorReply += `\`\`\``;
	util.successReply(message.channel, errorReply, null);
}
