class Guild {
  constructor (id, owner, prefix, pointsMin, pointsMax, pointsTimeout) {
    this.id = id
    this.owner = owner
    this.prefix = prefix

    this.points = { min: pointsMin, max: pointsMax, timeout: pointsTimeout }
    this.twitch = null
  }

  set twitch (twitch) {
    this.twitch = twitch
  }
}

module.exports = Guild
