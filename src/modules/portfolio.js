module.exports = {
  name: 'portfolio',
  type: 'core',
  usage: 'sell',
  example: 'sell 1 amd',
  permission: 1,
  help: 'Sell stock.',
  main: function (client, message) {
    client.generatePortfolioEmbed(message.author).then((emb, cash) => {
      if (!emb) message.channel.send('You do not have a simulator account! Create one using `(prefix)newacc` !')
      else message.channel.send(emb)
    })
  }
}
