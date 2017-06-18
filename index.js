const Discord = require('discord.js')
const client = new Discord.Client()

module.exports = {
  client: client
}

const util = require('./js/util')
util.start()

require('./js/eventLoader')(client)
