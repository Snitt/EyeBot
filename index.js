const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
  client: client
}

require('./js/eventLoader')(client)
require('./js/util').start()
