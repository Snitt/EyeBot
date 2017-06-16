const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	prefix(message, args);
}

function prefix(message, args) {
	reply = `\*\*Prefix:\*\* \`\`${data.guilds[message.guild.id].vars.prefix}\`\` - An \*\*ADMINISTRATOR\*\* can change it with \`\`${data.guilds[message.guild.id].vars.prefix}setprefix <prefix>\`\`\n`
	util.successReply(message.channel, reply, null);
}
