module.exports = {
  name: 'chart',
  type: 'core',
  usage: 'invite',
  example: 'invite',
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
      let time = 0.0
      let msg = await message.channel.send('Creating a chart for **' + _ticker.toUpperCase() + '** ' + _timeframe.toUpperCase() + '...\n\nTime elapsed: ' + time)

      let done = false

      let interval = setInterval(() => {
        if (done) clearInterval(interval)
        time += 0.5
        const newNum = bot.updateTimer(time)
        msg.edit('Creating a chart for ' + _ticker.toUpperCase() + ' ' + _timeframe.toUpperCase() + '\n\nTime elapsed: ' + newNum)
      }, 1000, time)

      bot.graphData(_ticker, _timeframe).then((buffer) => {
        done = true
        if (!buffer) return message.channel.send('An error occured, sorry!')
        else return message.channel.send('Graph complete!', { file: buffer })
      })
    }
  }
}
