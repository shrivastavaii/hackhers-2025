"use server"

export async function fetchStockData(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch stock data")
    }

    const data = await response.json()

    if (!data["Global Quote"]) {
      throw new Error("Invalid stock symbol")
    }

    return {
      price: Number.parseFloat(data["Global Quote"]["05. price"]),
      change: Number.parseFloat(data["Global Quote"]["09. change"]),
      changePercent: Number.parseFloat(data["Global Quote"]["10. change percent"].replace("%", "")),
      high: Number.parseFloat(data["Global Quote"]["03. high"]),
      low: Number.parseFloat(data["Global Quote"]["04. low"]),
      volume: Number.parseInt(data["Global Quote"]["06. volume"]),
    }
  } catch (error) {
    throw new Error("Failed to fetch stock data")
  }
}

export async function fetchHistoricalData(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch historical data")
    }

    const data = await response.json()

    if (!data["Time Series (Daily)"]) {
      throw new Error("Invalid stock symbol")
    }

    const timeSeriesData = data["Time Series (Daily)"]
    const historicalPrices = Object.entries(timeSeriesData)
      .map(([date, values]: [string, any]) => ({
        date,
        price: Number.parseFloat(values["4. close"]),
      }))
      .reverse()
      .slice(-30) // Get last 30 days of data

    return historicalPrices
  } catch (error) {
    throw new Error("Failed to fetch historical data")
  }
}
