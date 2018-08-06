const {tickers} = require('../../data/tickers.json')
const {RichEmbed} = require('discord.js')
const {User} = require('../../db')

module.exports = bot => {
  bot.enabled = function (command, guild) {
    if (command || guild) {
      return true
    } else {
      return false
    }
  }

  bot.permLevel = function (msg) {
    const {author, guild, member} = msg

    if (msg.channel.type === 'dm') return 5

    if (process.env.OWNER === msg.author.id) {
      return 6
    } else if (author && guild && guild.owner && author.id === guild.owner.id) {
      return 5
    } else if (member.hasPermission('MANAGE_GUILD')) {
      return 4
    } else if (member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
      return 3
    } else if (member.hasPermission('MANAGE_MESSAGES')) {
      return 2
    } else {
      return 1
    }
  }

  bot.getTicker = function (ticker) {
    return (tickers.indexOf(ticker.toUpperCase()) > -1) ? ticker.toUpperCase() : false
  }
  bot.validateTimeframe = function (ticker) {
    return /[1d|1m|3m|6m|1y]/.test(ticker)
  }

  bot.getStockEmbed = async function (ticker) {
    const price = await bot.getStockPrice(ticker)
    const data = await bot.getStockData(ticker)
    const logo = await bot.getStockLogo(ticker)

    return new RichEmbed()
      .setTitle(`${data.companyName} (${ticker.toUpperCase()})`)
      .setDescription(`Price and other data for ${ticker.toUpperCase()}`)
      .setThumbnail(logo)
      .setColor(bot.redOrGreen(data.day5ChangePercent.toString()))
      .addField(`:moneybag: Price`, `**$${price}**`, true)
      .addField(`:moneybag: Marketcap`, `**$${bot.addCommas(data.marketcap)}**`, true)
      .addField(`:mountain: 1 Year High`, `**$${data.week52high}**`, true)
      .addField(`:small_red_triangle_down: 1 Year Low`, `**$${data.week52low}**`, true)
      .addBlankField()
      .addField(`${bot.redOrGreen(data.day5ChangePercent.toString(), true)} 5 Day Change`, `**${(parseFloat(data.day5ChangePercent) * 100).toFixed(2)}%**`, true)
      .addField(`${bot.redOrGreen(data.day30ChangePercent.toString(), true)} 30 Day Change`, `**${(parseFloat(data.day30ChangePercent) * 100).toFixed(2)}%**`, true)
      .addField(`${bot.redOrGreen(data.month3ChangePercent.toString(), true)} 3 Month Change`, `**${(parseFloat(data.month3ChangePercent) * 100).toFixed(2)}%**`, true)
      .addField(`${bot.redOrGreen(data.month6ChangePercent.toString(), true)} 6 Month Change`, `**${(parseFloat(data.month6ChangePercent) * 100).toFixed(2)}%**`, true)
  }

  bot.generatePortfolioEmbed = async function (author) {
    return new Promise(async (resolve, reject) => {
      const user = await User.findOne({id: author.id})
      const stocks = user.stocks

      if (!user) resolve(false)
      else {
        const emb = new RichEmbed()
          .setTitle(author.username + '\'s Portfolio')
          .setColor('GOLD')

        let totalAmt = 0

        const arr = stocks.map(s => s.ticker.toLowerCase())
        const balance = parseFloat(user.balance.toString())
        emb.addField(`Liquid Cash`, `$${bot.addCommas(balance.toFixed(2))}`)

        if (stocks.length > 0) {
          const priceData = await bot.getMultipleStockData(arr)

          for (let stock of stocks) {
            const price = parseFloat(priceData[stock.ticker.toUpperCase()].price)
            totalAmt += (price * stock.count)
            emb.addField(`$${stock.ticker.toUpperCase()} - ${bot.addCommas((stock.count * price).toFixed(2))}`, `${stock.count} @ ${price}`, true)
          }
        }

        const desc = `\n\nTotal Portfolio Value: **$${bot.addCommas((totalAmt + balance).toFixed(2))}**`

        emb.setDescription(desc)
        resolve(emb)
      }
    })
  }

  bot.redOrGreen = function (numStr, graph = false) {
    if (!graph) return (numStr.charAt(0) === '-') ? 'RED' : 'GREEN'
    else return (numStr.charAt(0) === '-') ? ':chart_with_downwards_trend:' : ':chart_with_upwards_trend:'
  }

  bot.addCommas = function (x) {
    if (!x) {
      return 'N/A'
    } else {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
