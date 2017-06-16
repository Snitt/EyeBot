const main = require('../../eye.js');

const util = require('../util.js');
const jChangelog = require('../../json/changelog.json');

module.exports.command = function(message, args) {
	changelog(message, args);
}

function changelog(message, args) {
	reply = `\*\*Changelog\*\*\n`
	+ `\`\`\``;

	for (change in jChangelog) {
		reply += `${change} | ${jChangelog[change].date} - ${jChangelog[change].description}\n`;
	}

	reply += `\`\`\``;
	util.successReply(message.channel, reply, null);
}
