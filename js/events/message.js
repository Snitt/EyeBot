const Snekfetch = require('snekfetch')
const fs = require('fs')

const util = require('../util')

module.exports = (message) => {
  if (message.author.bot) return

  if (message.attachments.size > 0) {
    Snekfetch.get(message.attachments.first().url)
    .then((response) => {
      fs.writeFile(`attachments/${message.id}.jpg`, response.body, (error) => {
        if (error) throw error

        setTimeout(() => {
          fs.unlink(`attachments/${message.id}.jpg`, (error) => {
            if (error) throw error
          })
        }, 3600000)
      })
    })
    .catch((error) => util.logError('message', error))
  }
}
