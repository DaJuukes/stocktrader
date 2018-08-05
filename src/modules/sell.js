module.exports = {
  name: 'sell',
  type: 'core',
  usage: 'sell',
  example: 'sell 1 amd',
  permission: 1,
  help: 'Sell stock.',
  main: function (client, message) {
    const ticker = message.args[1]
    const amount = message.args[0]

    client.sellStock(ticker, amount, message.author.id).then(({price, newTotal}) => {
      return message.channel.send(':white_check_mark:  Your sale of ' + amount + ' ' + ticker.toUpperCase() + ' stock @ $' + price + ' for a total of $' + client.addCommas(price * parseInt(amount)) + ' completed successfully. You now have ' + newTotal + ' ' + ticker.toUpperCase() + ' stock.')
    }).catch((err) => {
      if (err.message === 'user does not have enough stock') {
        return message.channel.send('You do not have sufficient inventory to sell ' + amount + ' of ' + ticker + ' stock.')
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
