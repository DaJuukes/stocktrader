const mongoose = require('mongoose')
const Decimal = require('decimal.js')

const stock = new mongoose.Schema({
  ticker: String,
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
      this.findOneAndUpdate({ _id: user._id }, { $inc: { 'balance': Decimal(amount).toFixed() } }).then((r) => resolve(r))
    }).catch((err) => reject(err))
  })
}

s.schema.statics.withdraw = async function (user, amount) {
  return new Promise((resolve, reject) => {
    this.validateWithdrawAmount(user, amount).then(() => {
      this.findOneAndUpdate({ _id: user._id }, { $inc: { 'balance': Decimal(0).minus(Decimal(amount)).toFixed() } }).then((r) => resolve(r))
    }).catch((err) => reject(err))
  })
}

s.schema.statics.validateDepositAmount = function (user, amount) {
  if (amount <= 0) return Promise.reject(new Error('zero or negative amount not allowed'))

  return Promise.resolve({})
}

s.schema.statics.validateWithdrawAmount = async function (user, amount) {
  amount = Decimal(amount)

  if (amount.isNaN()) return Promise.reject(new Error('amount is not a number'))
  else if (amount.greaterThan(Decimal(user.balance.toString()))) return Promise.reject(new Error('insufficient funds'))

  return Promise.resolve({})
}

module.exports = mongoose.model(s.name, s.schema)
