module.exports = {
  name: 'buy',
  type: 'core',
  usage: 'ping',
  example: 'ping',
  permission: 1,
  help: 'Tests the bot\'s ping time.',
  main: function (client, message) {
    const ticker = message.args[1]
    const amount = message.args[0]

    client.buyStock(ticker, amount, message.author.id).then(({price, newTotal}) => {
      return message.channel.send(':white_check_mark:  Your purchase of ' + amount + ' ' + ticker.toUpperCase() + ' @ $' + price + ' for a total of $' + client.addCommas(price * parseInt(amount)) + ' completed successfully. You now have ' + newTotal + ' ' + ticker.toUpperCase() + ' stock.')
    }).catch((err) => {
      if (err.message === 'insufficient funds') {
        return message.channel.send('You do not have sufficient funds to buy ' + amount + ' of ' + ticker + ' stock.')
      } else if (err.message === 'invalid ticker') {
        return message.channel.send('The ticker ' + ticker.toUpperCase() + ' is not a valid stock.')
      } else if (err.message === 'user didn\'t exist') {
        return message.channel.send('You did not have a simulator account, so I created one for you!')
      } else if (err.message === 'amount is not a valid number') {
        return message.channel.send('That amount is not a valid number. Remember, the syntax is (prefix)buy [amount] [stock ticker]')
      } else {
        client.log(err.message)
        return message.channel.send('Unexpected error occurred.')
      }
    })
  }
}
