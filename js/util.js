const main = require('../eye.js');

const data = require('./data.js');
const sql = require('./sql.js');
const util = require('./util.js');

module.exports.fetchMembers = function(guild) {
	return new Promise((resolve, reject) => {
		guild.fetchMembers()
		.then((guild) => {
			resolve(guild);
		})
		.catch((error) => {
			reject(error);
		})
	});
}

module.exports.tryUser = async function(user) {
	if (data.createNewUserObject(user.id)) {
		await sql.query(main.sprintf.vsprintf(sql.insertUser, [user.id]))
		.then((results) => { data.populateUserObject(user.id, results.insertId) })
		.catch((error) => { console.log(error); })
	}
}

module.exports.tryGuild = async function(guild) {
	if (data.createNewGuildObject(guild.id)) {
		await sql.query(main.sprintf.vsprintf(sql.insertGuild, [guild.id, data.users[guild.owner.id].vars.id, main.variables.default_prefix, main.variables.default_points_min, main.variables.default_points_max, main.variables.default_points_timeout]))
		.then((results) => { data.populateGuildObject(guild.id, results.insertId, data.users[guild.owner.id].vars.id, main.variables.default_prefix, main.variables.default_points_min, main.variables.default_points_max, main.variables.default_points_timeout, '') })
		.catch((error) => { console.log(error); })
	}
}

module.exports.tryChannel = async function(channel) {
	if (data.createNewChannelObject(channel.id)) {
		await sql.query(main.sprintf.vsprintf(sql.insertChannel, [channel.id, data.guilds[channel.guild.id].vars.id]))
		.then((results) => { data.populateChannelObject(channel.id, results.insertId, data.guilds[channel.guild.id].vars.id) })
		.catch((error) => { console.log(error); })
	}
}

module.exports.tryPoints = async function(user, guild) {
	if (data.createNewUserGuildsObject(user.id, guild.id)) {
		await sql.query(main.sprintf.vsprintf(sql.insertPoints, [data.users[user.id].vars.id, data.guilds[guild.id].vars.id, 0]))
		.then((results) => { data.populateUserGuildsObject(user.id, guild.id, results.insertId, 0) })
		.catch((error) => { console.log(error); })
	}
}

module.exports.errorReply = async function(channel, errorMessage, deleteTime) {
	let reply = `\*\*Error!\*\* - ${errorMessage}`;
	if (channel.type === 'text' && channel.guild.member(main.client.user).permissionsIn(channel).has('SEND_MESSAGES') === false) { return; }

	channel.send(reply)
	.then((message) => {
		if (deleteTime !== null) {
			message.delete(deleteTime)
			.catch((error) => console.log(error));
		}
	})
	.catch((error) => console.log(error));
}

module.exports.successReply = async function(channel, successMessage, deleteTime) {
	if (channel.type === 'text' && channel.guild.member(main.client.user).permissionsIn(channel).has('SEND_MESSAGES') === false) { return; }

	channel.send(successMessage)
	.then((message) => {
		if (deleteTime !== null) {
			message.delete(deleteTime)
			.catch((error) => console.log(error));
		}
	})
	.catch((error) => console.log(error));
}

module.exports.timeToHuman = function(seconds) {
	let reply = '';

	if ((seconds / 31556952) > 1.0) {
		if (Math.floor(seconds / 31556952) === 1) {
			reply += `${Math.floor(seconds / 31556952)} Year `;
		} else {
			reply += `${Math.floor(seconds / 31556952)} Years `;
		}
		seconds = seconds % 31556952;
	}

	if ((seconds / 2592000) > 1.0) {
		if (Math.floor(seconds / 2592000) === 1) {
			reply += `${Math.floor(seconds / 2592000)} Month `;
		} else {
			reply += `${Math.floor(seconds / 2592000)} Months `;
		}
		seconds = seconds % 2592000;
	}

	if ((seconds / 604800) > 1.0) {
		if (Math.floor(seconds / 604800) === 1) {
			reply += `${Math.floor(seconds / 604800)} Week `;
		} else {
			reply += `${Math.floor(seconds / 604800)} Weeks `;
		}
		seconds = seconds % 604800;
	}

	if ((seconds / 86400) > 1.0) {
		if (Math.floor(seconds / 86400) === 1) {
			reply += `${Math.floor(seconds / 86400)} Day `;
		} else {
			reply += `${Math.floor(seconds / 86400)} Days `;
		}
		seconds = seconds % 86400;
	}

	if ((seconds / 3600) > 1.0) {
		if (Math.floor(seconds / 3600) === 1) {
			reply += `${Math.floor(seconds / 3600)} Hour `;
		} else {
			reply += `${Math.floor(seconds / 3600)} Hours `;
		}
		seconds = seconds % 3600;
	}

	if ((seconds / 60) > 1.0) {
		if (Math.floor(seconds / 60) === 1) {
			reply += `${Math.floor(seconds / 60)} Minute `;
		} else {
			reply += `${Math.floor(seconds / 60)} Minutes `;
		}
		seconds = seconds % 60;
	}

	if (seconds > 0) {
		if (Math.floor(seconds) === 1) {
			reply += `${Math.floor(seconds)} Second`;
		} else {
			reply += `${Math.floor(seconds)} Seconds`;
		}
	}

	return reply;
}

module.exports.checkGuildName = function(guildMember, guild) {
	for (let i = 0; i < data.guilds[guild.id].wordfilter.length; i++) {
		if (guildMember.displayName.toLowerCase().replace(/\s+/g, '').includes(data.guilds[guild.id].wordfilter[i].phrase.toLowerCase().replace(/\s+/g, ''))) {
			if ((guildMember.hasPermission('ADMINISTRATOR') === false) && (guildMember.guild.member(main.client.user).highestRole.calculatedPosition > guildMember.highestRole.calculatedPosition)) {
				guildMember.setNickname(`Invalid Name`);
			}
		}
	}
}

module.exports.checkMessage = function(message, guild) {
	for (let i = 0; i < data.guilds[guild.id].wordfilter.length; i++) {
		if (message.member.hasPermission('MANAGE_MESSAGES') === false && message.guild.member(main.client.user).hasPermission('MANAGE_MESSAGES')) {
			if (message.content.toLowerCase().replace(/\s+/g, '').includes(data.guilds[guild.id].wordfilter[i].phrase.toLowerCase().replace(/\s+/g, ''))) {
				message.delete(0)
				.catch((error) => { console.log(error); })
			}
		}
	}
}

module.exports.checkTarget = function(phrase) {
	if (phrase.startsWith('<@')) {
		return phrase.replace('!', '').slice(2).slice(0, -1);
	} else {
		if (isNaN(phrase)) { return `Invalid userResolvable Argument!`; }

		if (data.usersArray[phrase] !== undefined) {
			return data.usersArray[phrase];
		} else {
			if (main.client.users.get(phrase)) {
				return main.client.users.get(phrase).id;
			} else {
				return `Could Not Find A User With Your userResolvable`;
			}
		}
	}
}

module.exports.checkTargetable = function(guild, user, target, checkBot) {
	if (target.id === main.client.user.id) return false;
	if (target.id === main.variables.owner) return false;

	if (checkBot) { if (guild.member(target).highestRole.calculatedPosition > guild.member(main.client.user).highestRole.calculatedPosition) return false; }

	if (guild.member(user).hasPermission('ADMINISTRATOR')) return true;
	if (guild.member(target).highestRole.calculatedPosition > guild.member(user).highestRole.calculatedPosition) return false;

	return true;
}

module.exports.bulkDelete = function(channelId, userId, beforeMessage, illiteration, currentDeleted, totalToDelete) {
	let finished = false;

	if (currentDeleted < totalToDelete) {
		if (illiteration < 10) {
			let channel = main.client.channels.get(channelId);

			if (channel !== undefined) {
				if ((totalToDelete - currentDeleted) > 100) {
					limit = 100;
				} else {
					limit = (totalToDelete - currentDeleted);
				}

				channel.fetchMessages({limit: limit, before: beforeMessage})
				.then((messages) => {
					messagesToDelete = [ ];

					for (message of messages.values()) {
						console.log(message.content);
						if (userId === null) {
							messagesToDelete.push(message); console.log(`Pushing ${message.content}`);
						} else {
							if (message.author.id === userId) { messagesToDelete.push(message); }
						}
					}

					if (messagesToDelete.length > 1) {
						channel.bulkDelete(messagesToDelete)
						.then((_messages) => {
							util.bulkDelete(channelId, userId, messages.last().id, illiteration + 1, currentDeleted + messagesToDelete.length, totalToDelete)
						})
					} else {
						if (currentDeleted > 1) {
							util.successReply(channel, `Deleted ${currentDeleted} Messages!`, null);
						} else {
							util.errorReply(channel, `Couldn't Delete Messages (Less than 2 Messages Found!)`, main.variables.default_delete);
						}
					}
				})
			}
		} else { finished = true; }
	} else { finished = true; }

	if (finished === true) {
		let channel = main.client.channels.get(channelId);

		if (channel !== undefined) {
			util.successReply(channel, `Deleted ${currentDeleted} Messages!`, null);
		}
	}
}

module.exports.checkUrl = function(string) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|)'+ // domain name
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator

	if (pattern.test(string)) { return true; }
	return false;
}

module.exports.shortenUrl = function(string) {
	return new Promise((resolve, reject) => {
		main.snekfetch.post(`https://www.googleapis.com/urlshortener/v1/url?key=${main.variables.google_token}`)
		.set('Content-Type', 'application/json')
		.send({'longUrl': string})
		.then((response) => {
			resolve(response.body.id);
		})
		.catch((response) => console.log(response.body))
	})
}

module.exports.addTimedEvent = function(eventType, guildId, channelId, targetId, seconds) {
	data.timedEvents.push({time: new Date().getTime() + seconds * 1000, eventtype: eventType, guildid: guildId, channelid: channelId, targetid: targetId})
}

module.exports.changePermission = function(guildId, channelId, targetId, permission, permissionValue) {
	if (main.client.guilds.get(guildId)) {
		let guild = main.client.guilds.get(guildId);

		if (guild.channels.get(channelId)) {
			let guildChannel = guild.channels.get(channelId);
			let permissionOverwrites = guildChannel.permissionOverwrites;

			let newPermissions = {};

			if (permissionOverwrites.has(targetId)) {
				let allowPermissions = new main.discord.Permissions(permissionOverwrites.get(targetId).allow).serialize();
				let denyPermissions = new main.discord.Permissions(permissionOverwrites.get(targetId).deny).serialize();

				for (i in allowPermissions) {
					if (allowPermissions[i] === true) {
						newPermissions[i] = true;
					}
				}

				for (i in denyPermissions) {
					if (denyPermissions[i] === true) {
						newPermissions[i] = false;
					}
				}
			}

			newPermissions[permission] = permissionValue;

			console.log(newPermissions);
			guildChannel.overwritePermissions(targetId, newPermissions);
		}
	}
}

module.exports.checkTimedEvents = function() {
	let currentTime = new Date().getTime();

	for (let i = 0; i < data.timedEvents.length; i++) {
		if (currentTime > data.timedEvents[i].time) {
			switch (data.timedEvents[i].eventtype) {
				case 'UNBAN':
					main.client.guilds.get(data.timedEvents[i].guildid).unban(data.timedEvents[i].targetid)
					.then((user) => {})
					.catch((error) => { console.log(error); })
					break;

				case 'UNMUTE':
					util.changePermission(data.timedEvents[i].guildid, data.timedEvents[i].channelid, data.timedEvents[i].targetid, 'SEND_MESSAGES', true);
					break;
			}

			data.timedEvents.splice(i, 1);
		}
	}
}

module.exports.checkTime = function(phrase) {
	let totalSeconds = 0;

	if (phrase.indexOf('w') !== -1) {
		aNum = returnNumber(phrase, phrase.indexOf('w')) * 604800;
		if (isNaN(aNum)) { return `Invalid Number On 'w'`;}
		totalSeconds += parseInt(aNum);
	}

	if (phrase.indexOf('d') !== -1) {
		aNum = returnNumber(phrase, phrase.indexOf('d')) * 86400;
		if (isNaN(aNum)) { return `Invalid Number On 'd'`;}
		totalSeconds += parseInt(aNum);
	}

	if (phrase.indexOf('h') !== -1) {
		aNum = returnNumber(phrase, phrase.indexOf('h')) * 3600;
		if (isNaN(aNum)) { return `Invalid Number On 'h'`;}
		totalSeconds += parseInt(aNum);
	}

	if (phrase.indexOf('m') !== -1) {
		aNum = returnNumber(phrase, phrase.indexOf('m')) * 60;
		if (isNaN(aNum)) { return `Invalid Number On 'm'`;}
		totalSeconds += parseInt(aNum);
	}

	if (phrase.indexOf('s') !== -1) {
		aNum = returnNumber(phrase, phrase.indexOf('s'));
		if (isNaN(aNum)) { return `Invalid Number On 's'`;}
		totalSeconds += parseInt(aNum);
	}

	if (totalSeconds === 0) {
		return `No Time Specified`;
	} else {
		return totalSeconds;
	}
}

function returnNumber(phrase, startIndex) {
	let stop = 0;

	for (let i = startIndex; i > 0; i--) {
		if (isNaN(phrase[i - 1])) {
			stop = i;
			break;
		}
	}

	if (phrase.slice(stop, startIndex).length > 0) {
		return phrase.slice(stop, startIndex);
	} else {
		return 'error';
	}
}
