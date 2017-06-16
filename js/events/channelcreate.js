const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

main.client.on('channelCreate', async (channel) => {
	if (channel.type === 'text' || channel.type === 'voice') {
		if (data.guilds[channel.guild.id] !== undefined) {
			await util.tryChannel(channel);
		}
	}
});
