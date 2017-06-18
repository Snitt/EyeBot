class User {
  constructor (id) {
    this.id = id
    this.guilds = { }
  }

  setGuilds (guildid, id, points, warns, mutes, kicks, bans) {
    this.guilds[guildid] = { id: id, points: points, warns: warns, mutes: mutes, kicks: kicks, bans: bans }
  }
}

module.exports = User
