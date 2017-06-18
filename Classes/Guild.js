class Guild {
  constructor (id, owner, prefix, pointsMin, pointsMax, pointsTimeout, log) {
    this.id = id
    this.owner = owner
    this.prefix = prefix
    this.log = log
    this.ready = false

    this.points = { min: pointsMin, max: pointsMax, timeout: pointsTimeout }
    this.twitch = null
  }
}

module.exports = Guild
