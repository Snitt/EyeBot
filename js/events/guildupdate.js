const main = require('../../eye.js');

const data = require('../data.js');
const sql = require('../sql.js');

main.client.on('guildUpdate', async (oldGuild, newGuild) => {
	if (oldGuild.owner.id !== newGuild.owner.id) {
		await sql.query(main.sprintf.vsprintf('UPDATE guilds SET owner = %s WHERE id = %s', [data.users[newGuild.owner.id].vars.id, data.guilds[newGuild.id].vars.id]))
		.then((result) => {
			data.guilds[newGuild.id].vars.owner = data.users[newGuild.owner.id].vars.id;
		})
		.catch((error) => { console.log(error); })
	}
});
