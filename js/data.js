var data = { users: { }, guilds: { }, channels: { } };
var dataArray = { users: [ ], guilds: [ ], channels: [ ] };

var timedEvents = [];

module.exports.users = data.users;
module.exports.guilds = data.guilds;
module.exports.channels = data.channels;

module.exports.usersArray = dataArray.users;
module.exports.guildsArray = dataArray.guilds;
module.exports.channelsArray = dataArray.channels;

module.exports.timedEvents = timedEvents;

module.exports.createNewUserObject = function(userId) {
	if (data.users[userId] === undefined) {
		data.users[userId] = { vars: { id: 0 } };
		data.users[userId].guilds = { };

		return true;
	}

	return false;
}

module.exports.createNewGuildObject = function(guildId) {
	if (data.guilds[guildId] === undefined) {
		data.guilds[guildId] = { ready: false, vars: { id: 0, owner: 0, prefix: '!', twitch_defaultchannel: '' }, points: { min: 0, max: 0, timeout: 0 }, wordfilter: [ ] };

		return true;
	}

	return false;
}

module.exports.createNewChannelObject = function(channelId) {
	if (data.channels[channelId] === undefined) {
		data.channels[channelId] = { vars: { id: 0 } };

		return true;
	}

	return false;
}

module.exports.createNewUserGuildsObject = function(userId, guildId) {
	if (data.users[userId].guilds[guildId] === undefined) {
		data.users[userId].guilds[guildId] = { id: 0, points: 0 };

		return true;
	}

	return false;
}

module.exports.populateUserObject = function(userId, id) {
	data.users[userId].vars.id = id;

	dataArray.users[id] = userId;
}

module.exports.populateGuildObject = function(guildId, id, owner, prefix, points_min, points_max, points_timeout, twitch_defaultchannel) {
	data.guilds[guildId].vars.id = id;
	data.guilds[guildId].vars.owner = owner;
	data.guilds[guildId].vars.prefix = prefix;
	data.guilds[guildId].vars.twitch_defaultchannel = twitch_defaultchannel;

	data.guilds[guildId].points.min = points_min;
	data.guilds[guildId].points.max = points_max;
	data.guilds[guildId].points.timeout = points_timeout;

	dataArray.guilds[id] = guildId;
}

module.exports.populateChannelObject = function(channelId, id, guild) {
	data.channels[channelId].vars.id = id;
	data.channels[channelId].vars.guild = guild;

	dataArray.channels[id] = channelId;
}

module.exports.populateUserGuildsObject = function(userId, guildId, id, points) {
	data.users[userId].guilds[guildId].id = id;
	data.users[userId].guilds[guildId].points = points;
}

module.exports.populateWordFilter = function(guildId, id, phrase) {
	data.guilds[guildId].wordfilter.push({ id: id, phrase: phrase});
}
