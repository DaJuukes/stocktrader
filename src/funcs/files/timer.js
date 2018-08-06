module.exports = bot => {
  bot.timerMessage = async function (message) {
    return new Promise((resolve, reject) => {

    })
  }

  bot.updateTimer = function (_num) {
    // Get second Value
    const num = _num.toString()
    const seconds = num.charAt(0)
    const _tenths = num.charAt(2)

    const tenths = (_tenths === '5') ? ':five:' : ':zero:'

    function parse (char) {
      switch (char) {
        case '0':
          return ':zero:'
        case '1':
          return ':one:'
        case '2':
          return ':two:'
        case '3':
          return ':three:'
        case '4':
          return ':four:'
        case '5':
          return ':five:'
        case '6':
          return ':six:'
        case '7':
          return ':seven:'
        case '8':
          return ':eight:'
        case '9':
          return ':nine:'
        case '':
          return ':zero:'
      }
    }

    return `${parse(seconds)} : ${tenths}`
  }
}
