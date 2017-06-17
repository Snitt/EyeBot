const data = require('../data')
const util = require('../util')

module.exports = async (guild) => {
  try {
    let newGuild = await util.fetchMembers(guild)

    await data.checkUser(newGuild.owner.user)
    await data.checkGuild(newGuild)

    for (let guildChannel of newGuild.channels.values()) { await data.checkChannel(guildChannel) }
    for (let guildMember of newGuild.members.values()) { await data.checkUser(guildMember.user) }

    data.data.guilds[newGuild.id].ready = true
  } catch (error) {
    util.logError('guildCreate', error)
  }
}
