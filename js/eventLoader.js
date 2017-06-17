const requestEvent = (event) => require(`./events/${event}`)

module.exports = (client) => {
  client.once('ready', () => requestEvent('ready')(client))

  client.on('channelCreate', requestEvent('channelCreate'))
  client.on('guildCreate', requestEvent('guildCreate'))

  client.on('disconnect', requestEvent('disconnect'))
  client.on('message', requestEvent('message'))
}
