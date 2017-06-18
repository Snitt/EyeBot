const requestEvent = (event) => require(`./events/${event}`)

module.exports = (client) => {
  client.once('ready', () => requestEvent('ready')(client))

  client.on('channelCreate', requestEvent('channelCreate'))
  client.on('guildCreate', requestEvent('guildCreate'))
  client.on('guildMemberAdd', requestEvent('guildMemberAdd'))

  client.on('disconnect', requestEvent('disconnect'))

  client.on('message', requestEvent('message'))
  client.on('messageUpdate', requestEvent('messageUpdate'))
  client.on('messageDelete', requestEvent('messageDelete'))
}
