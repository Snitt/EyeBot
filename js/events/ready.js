const util = require('../util')
const data = require('../data')

module.exports = async (client) => {
  client.user.setGame(`!help | @${client.user.tag} help | DM "help"`)

  for (let guild of client.guilds.values()) {
    try {
      let newGuild = await util.fetchMembers(guild)

      await data.checkUser(newGuild.owner.user)
      await data.checkGuild(newGuild)

      for (let guildChannel of newGuild.channels.values()) { await data.checkChannel(guildChannel) }
      for (let guildMember of newGuild.members.values()) {
        await data.checkUser(guildMember.user)
        await data.checkUserGuild(guildMember.user, newGuild)
      }

      data.data.guilds[newGuild.id].ready = true
    } catch (error) {
      util.logError('ready', error)
    }
  }
}
