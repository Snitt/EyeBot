const Channel = require('../Classes/Channel')
const Guild = require('../Classes/Guild')
const User = require('../Classes/User')
// const UserGuild = require('../Classes/UserGuild')

const sql = require('./sql')
const data = require('./data')

async function start () {
  await sql.query(`CREATE TABLE IF NOT EXISTS \`guilds\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`guildid\` VARCHAR(32) NOT NULL, \`owner\` INT NOT NULL, \`prefix\` VARCHAR(16) NOT NULL,
  \`points_min\` INT NOT NULL, \`points_max\` INT NOT NULL, \`points_timeout\` INT NOT NULL,
  \`twitch_defaultchannel\` VARCHAR(64) NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => console.log(error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`users\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`userid\` VARCHAR(32) NOT NULL, PRIMARY KEY (\`id\`));`)
  .catch((error) => console.log(error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`channels\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`channelid\` VARCHAR(32) NOT NULL, \`guild\` INT NOT NULL, PRIMARY KEY (\`id\`))`)
  .catch((error) => console.log(error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`userguilds\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`user\` INT NOT NULL, \`guild\` INT NOT NULL, \`points\` INT NOT NULL, PRIMARY KEY (\`id\`))`)
  .catch((error) => console.log(error))

  await sql.query(`CREATE TABLE IF NOT EXISTS \`wordfilter\` (\`id\` INT NOT NULL AUTO_INCREMENT,
  \`guild\` INT NOT NULL, \`phrase\` VARCHAR(64) NOT NULL, PRIMARY KEY (\`id\`))`)
  .catch((error) => console.log(error))

  await sql.query(`SELECT (\`id\`, \`guildid\`, \`owner\`, \`prefix\`, \`points_min\`, \`points_max\`,
  \`points_timeout\`, \`twitch_defaultchannel\`) FROM \`guilds\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {

    }
  })
  .catch((error) => console.log(error))

  await sql.query(`SELECT (\`id\`, \`guildid\`, \`owner\`, \`prefix\`, \`points_min\`, \`points_max\`,
  \`points_timeout\`, \`twitch_defaultchannel\`) FROM \`guilds\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.guilds[results[i].guildid] = new Guild(results[i].id, results[i].owner, results[i].prefix, results[i].points_min, results[i].points_max, results[i].points_timeout)

      if (results[i].twitch_defaultchannel) data.data.guilds[results[i].guildid].twitch(results[i].twitch_defaultchannel)
    }
  })
  .catch((error) => console.log(error))

  await sql.query(`SELECT (\`id\`, \`userid\`) FROM \`users\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.users[results[i].userid] = new User(results[i].id)
    }
  })
  .catch((error) => console.log(error))

  await sql.query(`SELECT (\`id\`, \`channelid\`, \`guild\`) FROM \`channels\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {
      data.data.channels[results[i].channelid] = new Channel(results[i].id, results[i].guild)
    }
  })
  .catch((error) => console.log(error))

  /*
  await sql.query(`SELECT (\`id\`, \`user\`, \`guild\`, \`points\`) FROM \`userguilds\``)
  .then((results) => {
    for (let i = 0; i < results.length; i++) {

    }
  })
  .catch((error) => console.log(error))
  */
}

module.exports = {
  start: start
}
