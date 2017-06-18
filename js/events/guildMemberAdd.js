const data = require('../data')
const util = require('../util')

module.exports = async (guildMember) => {
  try {
    await data.checkUser(guildMember.user)
    await data.checkUserGuild(guildMember.user, guildMember.guild)
  } catch (error) {
    util.logError('guildMemberAdd', error)
  }
}
