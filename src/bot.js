const path = require('path')
global.srcRoot = path.resolve(__dirname)

const DBL = require('dblapi.js')

const Discord = require('discord.js')
const bot = new Discord.Client()

require('./funcs.js')(bot)
const readdir = require('fs').readdir

if (process.env.DBOTSPW) {
  const dbl = new DBL(process.env.DBOTSPW, bot)

  dbl.on('posted', () => {
    return console.log('All server counts posted successfully!')
  })

  dbl.on('error', (err) => {
    return console.error(err)
  })

  console.log('Posting server counts...')
} else {
  console.log('No Discord Bot List token was found.')
}

bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()
bot.events = new Discord.Collection()

readdir(srcRoot + '/modules/', (err, files) => {
  if (err) throw err
  bot.handleMessage = require('./handlers/msgHandler.js')
  bot.log(`Loading ${files.length} commands!`)
  files.forEach(f => {
    try {
      var name = require(`./modules/${f}`).name
      bot.commands.set(name, require(`./modules/${f}`))
    } catch (e) {
      bot.log(`Unable to load command ${f}: ${e}`)
    }
  })
  bot.log(`Commands loaded!`)
})

readdir(srcRoot + '/events/', (err, files) => {
  if (err) throw err
  bot.log(`Loading ${files.length} events!`)
  files.forEach(file => {
    bot.events.set(file.substring(0, file.length - 3), require(`./events/${file}`))
    bot.on(file.split('.')[0], (...args) => {
      require(`./events/${file}`).run(bot, ...args)
    })
  })
  bot.log(`Events loaded!`)
})

if (process.env.TOKEN) {
  bot.login(process.env.TOKEN)
} else {
  console.log('no token provided')
}
