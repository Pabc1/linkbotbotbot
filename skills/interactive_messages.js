module.exports = function (controller) {
  // create special handlers for certain actions in buttons
  // if the button action is 'say', act as if user said that thing
  controller.middleware.receive.use(function (bot, message, next) {
    if (message.type === 'interactive_message_callback') {
      if (message.actions[0].name.match(/^delete$/)) {
        controller.storage.Link.delete({id: message.actions[0].value, userId: message.user}, (err, resp) => {
          if (err) console.log(err)
          if (resp) bot.reply(message, 'The link has been deleted')
        })
      }

      if (message.actions[0].name.match(/^say$/)) {
        var reply = message.original_message

        for (var a = 0; a < reply.attachments.length; a++) {
          reply.attachments[a].actions = null
        }

        var person = '<@' + message.user + '>'
        if (message.channel[0] === 'D') {
          person = 'You'
        }

        reply.attachments.push(
          {
            text: person + ' said, ' + message.actions[0].value
          }
        )

        bot.replyInteractive(message, reply)
      }
    }

    next()
  })
}
