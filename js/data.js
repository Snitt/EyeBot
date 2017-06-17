const Channel = require('../Classes/Channel')
const Guild = require('../Classes/Guild')
const User = require('../Classes/User')

const config = require('../json/config.json')
const sql = require('./sql')
const util = require('./util')

var data = { channels: { }, guilds: { }, users: { } }

async function checkChannel (channel) {
  if (data.channels[channel.id] == null) {
    await sql.query(`INSERT INTO \`channels\` VALUES (0, ?, ?)`, [channel.id, data.guilds[channel.guild.id].id])
    .then((results) => {
      data.channels[channel.id] = new Channel(results.insertId, data.guilds[channel.guild.id].id)
    })
    .catch((error) => util.logError('data', error))
  }
}

async function checkGuild (guild) {
  if (data.guilds[guild.id] == null) {
    await sql.query(`INSERT INTO \`guilds\` VALUES (0, ?, ?, ?, ?, ?, ?, 'NULL')`, [guild.id, data.users[guild.owner.id].id, config.bot.prefix, config.points.min, config.points.max, config.points.timeout])
    .then((results) => {
      data.guilds[guild.id] = new Guild(results.insertId, data.users[guild.owner.id].id, config.bot.prefix, config.points.min, config.points.max, config.points.timeout)
    })
    .catch((error) => util.logError('data', error))
  }
}

async function checkUser (user) {
  if (data.users[user.id] == null) {
    await sql.query(`INSERT INTO \`users\` VALUES (0, ?)`, [user.id])
    .then((results) => {
      data.users[user.id] = new User(results.insertId)
    })
    .catch((error) => util.logError('data', error))
  }
}

module.exports = {
  data: data,
  checkChannel: checkChannel,
  checkGuild: checkGuild,
  checkUser: checkUser
}
