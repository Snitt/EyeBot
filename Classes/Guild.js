class Guild {
  constructor (id, owner, prefix, pointsMin, pointsMax, pointsTimeout) {
    this.id = id
    this.owner = owner
    this.prefix = prefix
    this.ready = false

    this.points = { min: pointsMin, max: pointsMax, timeout: pointsTimeout }
    this.twitch = null
  }
}

module.exports = Guild
