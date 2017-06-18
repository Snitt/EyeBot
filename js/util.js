const Snekfetch = require('snekfetch')
const Discord = require('discord.js')
const config = require('../json/config.json')

const Channel = require('../Classes/Channel')
const Guild = require('../Classes/Guild')
const User = require('../Classes/User')
// const UserGuild = require('../Classes/UserGuild')

const index = require('../index')
const data = require('./data')
const sql = require('./sql')

async function start () {
  await sql.query(`CREATE TABLE IF NOT EXISTS \`guilds\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`guildid\` VARCHAR(32) NOT NULL, \`owner\` INT NOT NULL, \`prefix\` VARCHAR(16) NOT NULL,
  \`points_min\` INT NOT NULL, \`points_max\` INT NOT NULL, \`points_timeout\` INT NOT NULL,
  \`log\` VARCHAR(64), \`twitch_defaultchannel\` VARCHAR(64), PRIMARY KEY (\`id\`));`)
  .catch((error) => logError('util', error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`users\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`userid\` VARCHAR(32) NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => logError('util', error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`channels\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`channelid\` VARCHAR(32) NOT NULL, \`guild\` INT NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => logError('util', error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`userguilds\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`user\` INT NOT NULL, \`guild\` INT NOT NULL, \`points\` INT NOT NULL, \`warns\` INT NOT NULL,
  \`mutes\` INT NOT NULL, \`kicks\` INT NOT NULL, \`bans\` INT NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => logError('util', error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`wordfilters\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`guild\` INT NOT NULL, \`phrase\` VARCHAR(64) NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => logError('util', error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`errors\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`source\` VARCHAR(64) NOT NULL, \`error\` VARCHAR(512) NOT NULL, \`timestamp\` BIGINT NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => logError('util', error))

  await sql.query(`SELECT \`id\`, \`guildid\`, \`owner\`, \`prefix\`, \`points_min\`, \`points_max\`,
  \`points_timeout\`, \`log\`, \`twitch_defaultchannel\` FROM \`guilds\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.guilds[results[i].guildid] = new Guild(results[i].id, results[i].owner, results[i].prefix, results[i].points_min, results[i].points_max, results[i].points_timeout, results[i].log)
      data.dataArray.guilds[results[i].id] = results[i].guildid

      if (results[i].twitch_defaultchannel) { data.data.guilds[results[i].guildid].twitch = results[i].twitch_defaultchannel }
    }
  })
  .catch((error) => logError('util', error))

  await sql.query(`SELECT \`id\`, \`userid\` FROM \`users\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.users[results[i].userid] = new User(results[i].id)
      data.dataArray.users[results[i].id] = results[i].userid
    }
  })
  .catch((error) => logError('util', error))

  await sql.query(`SELECT \`id\`, \`channelid\`, \`guild\` FROM \`channels\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.channels[results[i].channelid] = new Channel(results[i].id, results[i].guild)
      data.dataArray.channels[results[i].id] = results[i].channelid
    }
  })
  .catch((error) => logError('util', error))

  await sql.query(`SELECT \`id\`, \`user\`, \`guild\`, \`points\`, \`warns\`, \`mutes\`, \`kicks\`, \`bans\` FROM \`userguilds\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.users[data.dataArray.users[results[i].user]].setGuilds(data.dataArray.guilds[results[i].guild], results[i].id, results[i].points, results[i].warns, results[i].mutes, results[i].kicks, results[i].bans)
    }
  })
  .catch((error) => logError('util', error))

  index.client.login(config.bot.token)
}

async function logError (source, error) {
  console.log(`There was an error in: ${source}\n${error}`)

  await sql.query(`INSERT INTO \`errors\` VALUES (0, ?, ?, ?)`, [source, error.message, new Date().getTime()])
  .catch((error) => `Error Writing An Error! \n${error}`)
}

function fetchMembers (guild) {
  return new Promise((resolve, reject) => {
    guild.fetchMembers()
    .then((newGuild) => resolve(newGuild))
    .catch((newGuild) => reject(newGuild))
  })
}

function shortenUrl (string) {
  return new Promise((resolve, reject) => {
    Snekfetch.post(`https://www.googleapis.com/urlshortener/v1/url?key=${config.api.google}`)
    .set('Content-Type', 'application/json')
    .send({'longUrl': string})
    .then((response) => resolve(response.body.id))
    .catch((response) => reject(response))
  })
}

function trySendBotMessage (message, header, string) {
  let channel = message.guild.channels.find(channel => channel.name === data.data.guilds[message.guild.id].log)

  if (channel && channel.permissionsFor(message.guild.member(index.client.user)).has('SEND_MESSAGES')) {
    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setDescription(`${header} In: **#${message.channel.name}**\n\n${string}`)
    .setFooter(`ID: ${message.id}`)
    .setTimestamp()

    channel.send({embed})
  }
}

module.exports = {
  logError: logError,
  shortenUrl: shortenUrl,
  trySendBotMessage: trySendBotMessage,
  start: start,
  fetchMembers: fetchMembers
}
