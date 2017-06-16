const main = require('../../eye.js');

const util = require('../util.js');

module.exports.command = function(message, args) {
	invite(message, args);
}

function invite(message, args) {
	reply = `\*\*Invite Command\*\*\n`

	main.client.generateInvite(535899286)
	.then((link) => {
		reply += `\n${link}`;
		util.successReply(message.channel, reply, null);
	})
	.catch((error) => { console.log(error); })
}
