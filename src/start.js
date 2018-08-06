const Discord = require('discord.js')

const isTravisBuild = process.argv[2] && process.argv[2] === '--travis'

const dotenv = require('dotenv')

if (isTravisBuild) dotenv.config({ path: './env/example.env' })
else dotenv.config({ path: './env/vars.env' })
if (isTravisBuild) process.exit(0)

const path = require('path')
global.srcRoot = path.resolve(__dirname)

if (!process.env.TOKEN) {
  console.log('no token')
  process.exit(0)
}

if (process.env.SHARDS !== '0') {
const Manager = new Discord.ShardingManager(srcRoot + '/bot.js', { totalShards: parseInt(process.env.SHARDS), token: process.env.TOKEN })
Manager.spawn()
} else {
  require('./bot.js')
}
