const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
  client: client
}

require('./js/util').start()
require('./js/eventLoader')(client)
