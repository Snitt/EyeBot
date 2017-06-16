const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

main.client.on('guildCreate', async (guild) => {
	let fGuild = await util.fetchMembers(guild);

	await util.tryUser(fGuild.owner.user);
	await util.tryGuild(fGuild);

	for (guildChannel of fGuild.channels.values()) {
		await util.tryChannel(guildChannel);
	}

	for (guildMember of fGuild.members.values()) {
		await util.tryUser(guildMember.user);
		await util.tryPoints(guildMember.user, fGuild);
	}

	data.guilds[guild.id].ready = true;
});
