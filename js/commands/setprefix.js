const main = require('../../eye.js');

const data = require('../data.js');
const sql = require('../sql.js');
const util = require('../util.js');

module.exports.command = function(message, args) {
	setprefix(message, args);
}

async function setprefix(message, args) {
	if (args[0] === undefined) { util.errorReply(message.channel, `Invalid Prefix!`, main.variables.default_delete); return; }
	if (args[0].length > 8) { util.errorReply(message.channel, `This Prefix Is Too Long (Max. 8)`, main.variables.default_delete); return; }

	await sql.query(main.sprintf.vsprintf(sql.updatePrefix, [args[0], data.guilds[message.guild.id].vars.id]))
	.then((results) => {
		data.guilds[message.guild.id].vars.prefix = args[0];
		util.successReply(message.channel, `Successfully Changed Prefix To: ${args[0]}`, null);
	})
	.catch((error) => { console.log(error); })
}
