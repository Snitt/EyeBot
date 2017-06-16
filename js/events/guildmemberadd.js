const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

main.client.on('guildMemberAdd', async (guildMember) => {
	if (data.guilds[guildMember.guild.id] !== undefined) {
		await util.tryUser(guildMember.user);
		await util.tryPoints(guildMember.user, guildMember.guild);

		util.checkGuildName(guildMember, guildMember.guild);
	}
});
