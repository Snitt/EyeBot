const main = require('../../eye.js');

const util = require('../util.js');

main.client.on('userUpdate', async (userOld, userNew) => {
	if (userOld.username !== userNew.username) {
		for (guild of main.client.guilds.values()) {
			if (guild.member(userNew) !== null) {
				util.checkGuildName(guild.member(userNew), guild);
			}
		}
	}
});
