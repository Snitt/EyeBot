const util = require('../util')

module.exports = async (message) => {
  if (message.author.bot) return
  var reply = ''

  if (message.content.length > 0) {
    reply += '**Message:** '

    if (message.content.length > 200) {
      reply += `${message.content.substring(0, 200)}...`
    } else {
      reply += message.content
    }
  }

  if (message.attachments.size > 0) {
    if (reply.length > 0) reply += `\n`

    reply += `**Attachments:** `

    for (let messageAttachment of message.attachments.values()) {
      await util.shortenUrl(messageAttachment.url)
      .then((url) => { reply += `${url} ` })
      .catch((error) => util.logError('messageDelete', error))
    }
  }

  util.trySendBotMessage(message, 'Message **Deleted**', reply)
}
