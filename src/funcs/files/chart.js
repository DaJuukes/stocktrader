const snekfetch = require('snekfetch')

module.exports = bot => {
  bot.getChartData = async function (ticker, timeframe) {
    const json = await snekfetch.get(process.env.API_URL + '/stock/' + ticker + '/chart/' + timeframe)
    return json.body
  }

  bot.graphData = async function (ticker, timeframe) {
    const data = await bot.getChartData(ticker, timeframe)
    // TODO
    return data
  }
}
