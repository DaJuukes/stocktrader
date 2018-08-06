module.exports = {
  name: 'newacc',
  type: 'core',
  usage: 'invite',
  example: 'invite',
  permission: 1,
  help: 'Generate support server/bot invite links',
  main: async function (bot, message) {
    const result = await bot.createUser(message.author.id, process.env.STARTING_CASH)

    if (result) return message.channel.send(':white_check_mark: Account created successfully. You now have **$' + process.env.STARTING_CASH + '** in credit.')
    else return message.channel.send('An error occurred, do you already have an account?')
  }
}
