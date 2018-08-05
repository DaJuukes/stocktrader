const Discord = require('discord.js')
const os = require('os')
const osu = require('node-os-utils')

module.exports = {
  name: 'stats',
  type: 'core',
  usage: 'stats',
  permission: 1,
  help: 'Check bot stats.',
  main: async function (bot, message) {
    const date = new Date(bot.uptime)
    const uptime = date.getUTCDate() - 1 + 'd ' + date.getUTCHours() + 'h ' + date.getUTCMinutes() + 'm ' + date.getUTCSeconds() + 's'
    const cpuUsage = await osu.cpu.usage()

    let users
    await bot.shard.fetchClientValues('users.size').then(u => {
      users = u.reduce((a, b) => a + b, 0)
    }).catch(bot.error)
    let channels
    await bot.shard.fetchClientValues('channels.size').then(u => {
      channels = u.reduce((a, b) => a + b, 0)
    }).catch(bot.error)
    let guilds
    await bot.shard.fetchClientValues('guilds.size').then(u => {
      guilds = u.reduce((a, b) => a + b, 0)
    }).catch(bot.error)

    const shardID = bot.shard.id
    const shardCount = bot.shard.count

    let emb = new Discord.RichEmbed()
      .setTitle(`DisCrypto Stats`)
      .setDescription(`\n\n`)
      .setColor(`GREEN`)
    // .setThumbnail(bot.user.displayAvatarURL)
      .addField(`😀 Users`, users, true)
      .addField(`⌨ Channels`, channels, true)
      .addField(`🏆 Guilds`, guilds, true)
      .setFooter(`Made by DaJuukes#0001`)

    if (bot.permLevel(message) === 6) {
      // owner stats
      const cores = os.cpus().length
      const speed = os.cpus()[0].speed / 1000
      const ram = (process.memoryUsage().heapUsed) / 1024 / 1000
      emb.addField(`🖥 CPU Cores`, cores, true)
        .addField(`🕐 Clockspeed`, speed + ' GHz', true)
        .addField(`💾 Memory Usage`, Math.trunc(ram) + 'MB / ' + Math.trunc(os.totalmem() / 1024 / 1000) + 'MB', true)
        .addField(`:clock9: Uptime`, uptime, true)
        .addField(`💻 CPU Usage`, cpuUsage + '%', true)
        .addField(`OS Type`, os.type(), true)
        .addField(`🔽 Current Shard`, shardID + 1, true)
        .addField(`💠 Total Shards`, shardCount, true)
        .addField(`📖 Library`, `Discord.JS 11.3.1`, true)
        .setTimestamp()
        .setAuthor(bot.user.username, bot.user.avatarURL)
      message.channel.send(emb)
    } else {
      message.channel.send(emb)
    }
  }
}
