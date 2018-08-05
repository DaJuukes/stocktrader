const {tickers} = require('../../data/tickers.json')
const {RichEmbed} = require('discord.js')

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
    return tickers.indexOf(ticker.toUpperCase()) > -1
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
