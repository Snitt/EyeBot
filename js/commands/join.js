const main = require('../../eye.js');

const util = require('../util.js');

module.exports.command = function(message, args) {
	join(message, args);
}

function join(message, args) {
	reply = `\*\*Join Command\*\*\n`
	+ `\nhttps://discord.gg/c9RxtD5`;

	util.successReply(message.channel, reply, null);
}
