const data = require('../data')
const util = require('../util')

module.exports = async (guildMember) => {
  try {
    await data.checkUser(guildMember.user)
  } catch (error) {
    util.logError('guildMemberAdd', error)
  }
}
