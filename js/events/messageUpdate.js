const fs = require('fs')

const util = require('../util')

module.exports = async (oldMessage, newMessage) => {
  if (newMessage.author.bot) return

  if (oldMessage.content !== newMessage.content) {
    let isNewAttachment = oldMessage.attachments.first() === newMessage.attachments.first()
    var reply = ''

    if (!isNewAttachment) {
      reply += `**Attachment:** `

      await util.shortenUrl(newMessage.attachments.first().url)
      .then((url) => { reply += `${url}\n\n` })
      .catch((error) => util.logError('messageUpdate', error))
    }

    if (oldMessage.content.length > 0) {
      reply += '**Old Message:** '

      if (oldMessage.content.length > 100) {
        reply += `${oldMessage.content.substring(0, 100)}...\n`
      } else {
        reply += `${oldMessage.content}\n`
      }
    }

    if (oldMessage.attachments.size > 0) {
      if (isNewAttachment) {
        reply += `**Old Attachment:** `

        fs.stat(`attachments/${oldMessage.id}.jpg`, async (error, stat) => {
          if (error == null) {
            await util.imgurUpload(`attachments/${oldMessage.id}.jpg`)
            .then(async (data) => {
              await util.shortenUrl(data.data.link)
              .then((url) => { reply += `${url}\n` })
              .catch((error) => util.logError('messageDelete', error))
            })
            .catch((error) => util.logError('messageDelete', error))
          } else {
            reply += `Unavailable`
          }
        })
      }
    }

    if (newMessage.content.length > 0) {
      reply += '**New Message:** '

      if (newMessage.content.length > 100) {
        reply += `${newMessage.content.substring(0, 100)}...\n`
      } else {
        reply += `${newMessage.content}\n`
      }
    }

    if (newMessage.attachments.size > 0) {
      if (isNewAttachment) {
        reply += `**New Attachments:** `

        await util.shortenUrl(newMessage.attachments.first().url)
        .then((url) => { reply += `${url}\n` })
        .catch((error) => util.logError('messageUpdate', error))
      }
    }

    util.trySendBotMessage(newMessage, 'Message **Changed**', reply)
  }
}
