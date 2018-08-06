const {User} = require('../../db')

module.exports = bot => {
  bot.validateUser = function (id) {
    return User.findOne({id})
  }

  bot.createUser = async function (id, money) {
    const user = await User.findOne({id})
    if (user) return false
    else return User.create({id, balance: money})
  }

  bot.buyStock = async function (ticker, _amount, userID) {
    return new Promise((resolve, reject) => {
      const amount = parseInt(_amount)
      if (isNaN(amount) || amount <= 0) reject(new Error('amount is not a valid number'))
      if (isNaN(amount)) reject(new Error('amount is not a number'))
      bot.validateUser(userID).then(user => {
        if (!user) {
          reject(new Error('user didn\'t exist'))
        }
        const isTickerValid = bot.getTicker(ticker)
        if (isTickerValid) {
          bot.getStockPrice(ticker).then(price => {
            const totalCost = price * amount

            User.buyStock(user, ticker.toUpperCase(), amount, totalCost).then((newTotal) => {
              resolve({price, newTotal})
            }).catch(err => {
              reject(err)
            })
          })
        } else {
          reject(new Error('invalid ticker'))
        }
      })
    })
  }

  bot.sellStock = async function (ticker, _amount, userID) {
    return new Promise((resolve, reject) => {
      const amount = parseInt(_amount)
      if (isNaN(amount) || amount <= 0) reject(new Error('amount is not a valid number'))
      bot.validateUser(userID).then(user => {
        if (!user) {
          reject(new Error('user didn\'t exist'))
        }
        const isTickerValid = bot.getTicker(ticker)
        if (isTickerValid) {
          bot.getStockPrice(ticker).then(price => {
            const totalCost = price * amount
            User.sellStock(user, ticker.toUpperCase(), amount, totalCost).then((newTotal) => {
              resolve({price, newTotal})
            }).catch(err => {
              reject(err)
            })
          })
        } else {
          reject(new Error('invalid ticker'))
        }
      })
    })
  }
}
