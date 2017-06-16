const Discord = require('discord.js')
const client = new Discord.Client()

require('./js/events').start()

module.exports = {
  client: client
}
