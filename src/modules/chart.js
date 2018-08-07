module.exports = {
  name: 'chart',
  type: 'core',
  usage: 'chart [ticker] [timeframe]',
  example: 'chart',
  permission: 1,
  help: 'Generate support server/bot invite links',
  main: async function (bot, message) {
    const _ticker = message.args[0]
    const _timeframe = message.args[1]

    const tickerValid = bot.getTicker(_ticker)
    const timeframeValid = bot.validateTimeframe(_timeframe)

    if (!tickerValid || !timeframeValid) {
      return message.channel.send('That is not a valid stock ticker or timeframe.')
    } else {
      const msg = await message.channel.send('Creating a chart for **$' + _ticker.toUpperCase() + '** ' + _timeframe.toUpperCase() + '...')

      bot.graphData(_ticker, _timeframe).then((buffer) => {
        if (!buffer) return msg.edit('An error occured, sorry!')
        else return msg.delete().then(() => message.channel.send('', { file: buffer }))
      })
    }
  }
}
