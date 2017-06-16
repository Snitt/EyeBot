const main = require('../../eye.js');

const util = require('../util.js');

main.client.on('guildMemberUpdate', async (guildMemberOld, guildMemberNew) => {
	if (guildMemberOld.displayName !== guildMemberNew.displayName) {
		util.checkGuildName(guildMemberNew, guildMemberNew.guild);
	}
});
