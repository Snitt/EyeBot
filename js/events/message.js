const main = require('../../eye.js');

const commands = require('../commands.js');
const data = require('../data.js');
const util = require('../util.js');

main.client.on('message', async (message) => {
	if (message.author.bot) return;

	commands.command(message);

	if (message.channel.type === 'text') {
		if (data.guilds[message.guild.id] !== undefined) {
			util.checkMessage(message, message.guild);
		}
	}
});
