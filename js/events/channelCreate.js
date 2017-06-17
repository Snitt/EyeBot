const data = require('../data')
const util = require('../util')

module.exports = async (channel) => {
  let isGuildChannel = (channel.type === 'text' || channel.type === 'voice')

  if (isGuildChannel) {
    try {
      await data.checkChannel(channel)
    } catch (error) {
      util.logError('channelCreate', error)
    }
  }
}
