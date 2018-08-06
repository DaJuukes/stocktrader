module.exports = {
  name: 'balance',
  type: 'core',
  usage: 'buy',
  example: 'buy',
  permission: 1,
  help: 'Buy stock.',
  main: async function (client, message) {
    const user = await client.validateUser(message.author.id)

    if (!user) message.channel.send('You do not have a simulator account! Create one using `(prefix)newacc`')
    message.channel.send('You have a total of **$' + client.addCommas(user.balance.toString()) + '** in your account.')
  }
}
