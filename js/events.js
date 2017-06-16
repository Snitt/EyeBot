const main = require('../eye.js');

const data = require('./data.js');
const sql = require('./sql.js');

const channelCreate = require('./events/channelcreate.js');
const disconnect = require('./events/disconnect.js');
const guildCreate = require('./events/guildcreate.js');
const guildMemberAdd = require('./events/guildmemberadd.js');
const guildMemberUpdate = require('./events/guildmemberupdate.js');
const guildUpdate = require('./events/guildupdate.js');
const message = require('./events/message.js');
const ready = require('./events/ready.js');
const userUpdate = require('./events/userupdate.js');

module.exports.start = async function() {
	await sql.query(`CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, userid VARCHAR(32) NOT NULL, PRIMARY KEY (id));`);
	await sql.query(`CREATE TABLE IF NOT EXISTS guilds (id INT NOT NULL AUTO_INCREMENT, guildid VARCHAR(32) NOT NULL, owner INT NOT NULL, prefix VARCHAR(8) NOT NULL, points_min INT NOT NULL, points_max INT NOT NULL, points_timeout INT NOT NULL, twitch_defaultchannel VARCHAR(64) NOT NULL, PRIMARY KEY (id));`);
	await sql.query(`CREATE TABLE IF NOT EXISTS channels (id INT NOT NULL AUTO_INCREMENT, channelid VARCHAR(32) NOT NULL, guild INT NOT NULL, PRIMARY KEY (id));`);
	await sql.query(`CREATE TABLE IF NOT EXISTS userguilds (id INT NOT NULL AUTO_INCREMENT, user INT NOT NULL, guild INT NOT NULL, points INT NOT NULL, PRIMARY KEY (id));`);
	await sql.query(`CREATE TABLE IF NOT EXISTS wordfilter (id INT NOT NULL AUTO_INCREMENT, guild INT NOT NULL, phrase VARCHAR(64) NOT NULL, PRIMARY KEY (id));`);

	await sql.query(`SELECT * FROM guilds`)
	.then((results) => {
		for (let i = 0; i < results.length; i++) {
			data.createNewGuildObject(results[i].guildid);
			data.populateGuildObject(results[i].guildid, results[i].id, results[i].owner, results[i].prefix, results[i].points_min, results[i].points_max, results[i].points_timeout, results[i].twitch_defaultchannel);
		}
	})
	.catch((error) => { console.log(error); })

	await sql.query(`SELECT * FROM users`)
	.then((results) => {
		for (let i = 0; i < results.length; i++) {
			data.createNewUserObject(results[i].userid);
			data.populateUserObject(results[i].userid, results[i].id);
		}
	})
	.catch((error) => { console.log(error); })

	await sql.query(`SELECT * FROM userguilds`)
	.then((results) => {
		for (let i = 0; i < results.length; i++) {
			data.createNewUserGuildsObject(data.usersArray[results[i].user], data.guildsArray[results[i].guild]);
			data.populateUserGuildsObject(data.usersArray[results[i].user], data.guildsArray[results[i].guild], results[i].id, results[i].points);
		}
	})
	.catch((error) => { console.log(error); })

	await sql.query(`SELECT * FROM channels`)
	.then((results) => {
		for (let i = 0; i < results.length; i++) {
			data.createNewChannelObject(results[i].channelid);
			data.populateChannelObject(results[i].channelid, results[i].id, results[i].guild);
		}
	})
	.catch((error) => { console.log(error); })

	await sql.query(`SELECT * FROM wordfilter`)
	.then((results) => {
		for (let i = 0; i < results.length; i++) {
			data.populateWordFilter(data.guildsArray[results[i].guild], results[i].id, results[i].phrase);
		}
	})

	main.client.login(main.variables.bot_token);
}
