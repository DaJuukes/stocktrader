const snekfetch = require('snekfetch')

module.exports = bot => {
  bot.getStockPrice = async function (ticker) {
    const json = await snekfetch.get(process.env.API_URL + '/stock/' + ticker + '/price')
    return json.body
  }

  bot.getMultipleStockData = async function (tickerArr) {
    const str = tickerArr.join(',')
    const json = await snekfetch.get(process.env.API_URL + '/stock/market/batch?symbols=' + str + '&types=price')
    return json.body
  }

  bot.getStockData = async function (ticker) {
    const json = await snekfetch.get(process.env.API_URL + '/stock/' + ticker + '/stats')
    return json.body
  }

  bot.getStockLogo = async function (ticker) {
    const json = await snekfetch.get(process.env.API_URL + '/stock/' + ticker + '/logo')
    return json.body.url
  }
}
