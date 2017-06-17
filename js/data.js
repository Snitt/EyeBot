const Channel = require('./Classes/Channel')

const sql = require('./sql')
const util = require('./util')

var data = { channels: { }, guilds: { }, users: { } }

async function checkChannel (channel) {
  if (data.channels[channel.id] == null) {
    await sql.query(`INSERT INTO \`guilds\` VALUES (0, ?, ?)`, [channel.id, data.guilds[channel.guild.id].id])
    .then((results) => {
      data.channels[channel.id] = new Channel(results.insertId, data.guilds[channel.guild.id].id)
    })
    .catch((error) => util.logError('data', error))
  }
}

async function checkGuild (guild) {
  if (data.guilds[guild.id] == null) {
    
  }
}

async function checkUser (user) {
  if (data.users[user.id] == null) {

  }
}

module.exports = {
  checkChannel: checkChannel,
  checkGuild: checkGuild,
  checkUser: checkUser,
  data: data
}
