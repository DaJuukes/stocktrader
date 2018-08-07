module.exports = {
  name: 'newacc',
  type: 'core',
  usage: 'newacc',
  example: 'newacc',
  permission: 1,
  help: 'Create a new simulator account!',
  main: async function (bot, message) {
    const result = await bot.createUser(message.author.id, process.env.STARTING_CASH)

    if (result) return message.channel.send(':white_check_mark: Account created successfully. You now have **$' + process.env.STARTING_CASH + '** in credit.')
    else return message.channel.send('An error occurred, do you already have an account?')
  }
}
