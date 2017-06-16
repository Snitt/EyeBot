const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	shorten(message, args);
}

async function shorten(message, args) {
	if (args.length < 1) { util.errorReply(message.channel, `Please Specify A Url`, main.variables.default_delete); return; }

	if (!util.checkUrl(args[0])) { util.errorReply(message.channel, `Invalid URL`, main.variables.default_delete); return; }

	util.successReply(message.channel, `Shortened Link: ${await util.shortenUrl(args[0])}`, null);
}
