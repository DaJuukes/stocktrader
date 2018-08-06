const mongoose = require('mongoose')

const stock = new mongoose.Schema({
  ticker: {
    type: String,
    unique: true
  },
  count: Number
})

let s = {
  name: 'User',
  schema: new mongoose.Schema({
    id: {
      type: String,
      unique: true
    },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: '0.0'
    },
    stocks: {
      type: [stock]
    }
  }, {
    timestamps: true
  })
}

s.schema.statics.deposit = async function (user, amount) {
  return new Promise((resolve, reject) => {
    this.validateDepositAmount(user, amount).then(() => {
      this.findOneAndUpdate({ _id: user._id }, { $inc: { 'balance': amount } }).then((r) => resolve(r))
    }).catch((err) => reject(err))
  })
}

s.schema.statics.withdraw = async function (user, amount) {
  return new Promise((resolve, reject) => {
    this.validateWithdrawAmount(user, amount).then(() => {
      this.findOneAndUpdate({ _id: user._id }, { $inc: { 'balance': 0 - amount } }).then((r) => resolve(r))
    }).catch((err) => reject(err))
  })
}

s.schema.statics.validateDepositAmount = function (user, amount) {
  if (amount <= 0) return Promise.reject(new Error('zero or negative amount not allowed'))

  return Promise.resolve({})
}

s.schema.statics.validateWithdrawAmount = async function (user, amount) {
  if (isNaN(amount)) return Promise.reject(new Error('amount is not a number'))
  else if (amount > user.balance) return Promise.reject(new Error('insufficient funds'))

  return Promise.resolve({})
}

s.schema.statics.buyStock = async function (user, ticker, amount, totalCost) {
  return new Promise((resolve, reject) => {
    this.withdraw(user, totalCost).then(async () => {
      const _stockAmt = await this.findOne({ _id: user._id, 'stocks.ticker': ticker }, { 'stocks.$.count': 1 })
      let stockAmt
      if (!_stockAmt) stockAmt = 0
      else stockAmt = _stockAmt.stocks[0].count
      if (!stockAmt) {
        this.findOneAndUpdate({_id: user._id}, { $push: { stocks: { ticker, count: amount } } }).then(() => {
          resolve(amount)
        })
      } else {
        this.findOneAndUpdate({ _id: user._id, 'stocks.ticker': ticker }, { $inc: { 'stocks.$.count': amount } }).then(() => {
          resolve(stockAmt + amount)
        })
      }
    }).catch(err => {
      reject(err)
    })
  })
}

s.schema.statics.sellStock = async function (user, ticker, amount, totalCost) {
  return new Promise(async (resolve, reject) => {
    const _stockAmt = await this.findOne({ _id: user._id, 'stocks.ticker': ticker }, { 'stocks.$.count': 1 })
    let stockAmt
    if (!_stockAmt) stockAmt = 0
    else stockAmt = _stockAmt.stocks[0].count

    if (!stockAmt || stockAmt < amount) {
      reject(new Error('user does not have enough stock'))
    } else {
      this.findOneAndUpdate({ _id: user._id, 'stocks.ticker': ticker }, { $inc: { 'stocks.$.count': -amount } }).then(() => {
        this.deposit(user, totalCost).then(() => {
          if (amount === stockAmt) {
            this.update({ _id: user._id }, { $pull: { stocks: { ticker: ticker } } }).then(() => {
              resolve(stockAmt - amount)
            })
          } else {
            resolve(stockAmt - amount)
          }
        }).catch(reject)
      }).catch(reject)
    }
  })
}

module.exports = mongoose.model(s.name, s.schema)
