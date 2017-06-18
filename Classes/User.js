class User {
  constructor (id) {
    this.id = id
    this.guilds = { }
  }

  setGuilds (guildid, id, points) {
    this.guilds[guildid] = { id: id, points: points }
  }
}

module.exports = User
