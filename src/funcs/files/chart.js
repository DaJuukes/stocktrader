const ChartJS = require('chartjs-node')
if (global.CanvasGradient === undefined) {
  global.CanvasGradient = function () {}
}

const snekfetch = require('snekfetch')

let arr = ['1d', '5d', '1m', '3m', '6m', '1y', 'ytd', '2y', '5y']

module.exports = bot => {
  bot.validateTimeframe = function (ticker) {
    return arr.indexOf(ticker.toLowerCase()) > -1
  }

  bot.getChartData = async function (ticker, timeframe) {
    const json = await snekfetch.get(process.env.API_URL + '/stock/' + ticker + '/chart/' + timeframe)
    return json.body
  }

  bot.graphData = async function (ticker, timeframe) {
    // const data = await bot.getChartData(ticker, timeframe)
    // TODO
    const chart = new ChartJS(1600, 800)

    let obj

    switch (timeframe.toLowerCase()) {
      case '1d':
        obj = await bot.graph1Day(ticker)
        break
      case '5d':
        obj = await bot.graph5Day(ticker)
        break
      case '1m':
        obj = await bot.graph1Month(ticker)
        break
      case '3m':
        obj = await bot.graph3Month(ticker)
        break
      case '6m':
        obj = await bot.graph6Month(ticker)
        break
      case '1y':
        obj = await bot.graph1Year(ticker)
        break
      case 'ytd':
        obj = await bot.graphYTD(ticker)
        break
      case '2y':
        obj = await bot.graph2Year(ticker)
        break
      case '5y':
        obj = await bot.graph5Year(ticker)
        break
      default:
        return false
    }

    const options = {
      type: 'line',
      plugins: [{
        beforeDraw: function (chartInstance) {
          var ctx = chartInstance.chart.ctx
          ctx.fillStyle = '#BEBEBE'
          ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)
        }
      }],
      data: {
        labels: obj.labels,
        datasets: [{
          label: 'Price',
          data: obj.arr,
          backgroundColor: 'green',
          borderColor: 'green',
          fill: false,
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: `$${ticker.toUpperCase()} - ${timeframe.toUpperCase()} Chart`,
          fontSize: 28,
          fontColor: 'black'
        },
        legend: {
          display: true,
          labels: {
            fontSize: 20,
            fontColor: 'black'
          }
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,

              fontSize: 28,
              fontColor: 'black'
            },
            ticks: {
              fontSize: obj.fontSize,
              fontColor: 'black'
            },
            gridLines: {
              drawOnChartArea: true
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value',
              fontSize: 28,
              fontColor: 'black'
            },
            ticks: {
              fontSize: 20,
              fontColor: 'black'
            }
          }]
        }
      }
    }

    return chart.drawChart(options).then(() => {
    // chart is created
      // get image as png buffer
      return chart.getImageBuffer('image/png')
    }).then((buffer) => {
      return buffer
    })
  }

  bot.graph1Day = async function (ticker) {
    /* Split into hours */

    const data = await bot.getChartData(ticker, '1d')

    let arr = []
    let labels = []

    let delta = Math.floor(data.length / 26)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push(data[i].average)
      labels.push(data[i].minute)
    }
    let fontSize = 25
    return {arr, labels, fontSize}
  }

  bot.graph5Day = async function (ticker) {
    const data = await bot.getChartData(ticker, '5d')
    let labels = []
    let arr = []

    for (let i = 0; i < data.length; i++) {
      labels.push(data[i].date.slice(5))
      arr.push((data[i].high + data[i].low) / 2)
    }
    let fontSize = 40
    return {arr, labels, fontSize}
  }

  bot.graph1Month = async function (ticker) {
    const data = await bot.getChartData(ticker, '1m')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 20)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date.slice(5))
    }

    let fontSize = 25
    return {arr, labels, fontSize}
  }

  bot.graph3Month = async function (ticker) {
    const data = await bot.getChartData(ticker, '3m')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 30)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date.slice(5))
    }

    let fontSize = 25
    return {arr, labels, fontSize}
  }

  bot.graph6Month = async function (ticker) {
    const data = await bot.getChartData(ticker, '6m')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 36)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date.slice(5))
    }

    let fontSize = 20
    return {arr, labels, fontSize}
  }

  bot.graph1Year = async function (ticker) {
    const data = await bot.getChartData(ticker, '1y')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 36)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date)
    }

    let fontSize = 12
    return {arr, labels, fontSize}
  }

  bot.graphYTD = async function (ticker) {
    const data = await bot.getChartData(ticker, 'ytd')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 24)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date.slice(5))
    }

    let fontSize = 20
    return {arr, labels, fontSize}
  }

  bot.graph2Year = async function (ticker) {
    const data = await bot.getChartData(ticker, '2y')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 60)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date)
    }

    let fontSize = 12
    return {arr, labels, fontSize}
  }

  bot.graph5Year = async function (ticker) {
    const data = await bot.getChartData(ticker, '5y')
    let labels = []
    let arr = []

    let delta = Math.floor(data.length / 40)
    for (let i = 0; i < data.length; i = i + delta) {
      arr.push((data[i].high + data[i].low) / 2)
      labels.push(data[i].date)
    }

    let fontSize = 20
    return {arr, labels, fontSize}
  }
}
