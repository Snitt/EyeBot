const main = require('../../eye.js');

const data = require('../data.js');
const util = require('../util.js');

main.client.once('ready', async () => {
	main.client.user.setGame(`@${main.client.user.tag} help`);

	for (guild of main.client.guilds.values()) {
		let fGuild = await util.fetchMembers(guild);

		await util.tryUser(fGuild.owner.user);
		await util.tryGuild(fGuild);

		for (guildChannel of fGuild.channels.values()) {
			await util.tryChannel(guildChannel);
		}

		for (guildMember of fGuild.members.values()) {
			await util.tryUser(guildMember.user);
			await util.tryPoints(guildMember.user, fGuild);

			await util.checkGuildName(guildMember, fGuild);
		}

		data.guilds[fGuild.id].ready = true;
	}

	main.snekfetch.post(`https://discordbots.org/api/bots/${main.client.user.id}/stats`)
	.set('Authorization', main.variables.discordbots_token)
	.send({'server_count' : main.client.guilds.size})
	.then((response) => console.log(response.body))
	.catch((response) => console.log(response.body))

	setInterval(util.checkTimedEvents, 1000);

	console.log(`Ready!`);
});
