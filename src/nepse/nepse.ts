/* eslint-disable @typescript-eslint/no-explicit-any */
import { Got } from 'got'
import fs from 'fs/promises'
import csv from 'csvtojson'
import { INepse } from './interfaces'
import { TTodaysPrice } from './types'

export class Nepse implements INepse {
  private readonly endpoint = 'https://newweb.nepalstock.com/api'

  private parsingOptions = {
    delimiter: ',',
    quote: '"',
    trim: true,
    flatKeys: true,
  }

  constructor(private got: Got) {}

  async getTodaysPricesRaw(date: string): Promise<string> {
    const { statusCode, body } = await this.got.get(
      `${this.endpoint}/nots/market/export/todays-price/${date}`,
      {
        https: { rejectUnauthorized: false },
        throwHttpErrors: false,
      },
    )

    if (statusCode === 200) {
      return body
    }

    throw new Error(`Unable to fetch data. Received StatusCode: ${statusCode}`)
  }

  async getTodaysPrices(date: string): Promise<TTodaysPrice[]> {
    const rawCsv = await this.getTodaysPricesRaw(date)

    let parsedData = await csv(this.parsingOptions).fromString(rawCsv)

    parsedData = parsedData.map((d) => this.transformData(d))

    return parsedData
  }

  async downloadCsv(date: string, path: string): Promise<void> {
    const rawCsv = await this.getTodaysPricesRaw(date)

    await fs.writeFile(`${path}/${date}.csv`, rawCsv)
  }

  transformData(data: Record<string, any>): TTodaysPrice {
    return {
      serialNumber: parseFloat(data['S.N']),
      businessDate: data.BUSINESS_DATE,
      securityId: parseInt(data.SECURITY_ID),
      symbol: data.SYMBOL,
      securityName: data.SECURITY_NAME,
      openPrice: parseFloat(data.OPEN_PRICE),
      highPrice: parseFloat(data.HIGH_PRICE),
      lowPrice: parseFloat(data.LOW_PRICE),
      closePrice: parseFloat(data.CLOSE_PRICE),
      totalTradedQuantity: parseInt(data.TOTAL_TRADED_QUANTITY),
      totalTradedValue: parseFloat(data.TOTAL_TRADED_VALUE),
      previousDayClosePrice: parseFloat(data.PREVIOUS_DAY_CLOSE_PRICE),
      fiftyTwoWeekHigh: parseFloat(data.FIFTY_TWO_WEEKS_HIGH),
      fiftyTwoWeekLow: parseFloat(data.FIFTY_TWO_WEEKS_LOW),
      lastUpdatedTime: data.LAST_UPDATED_TIME,
      lastUpdatedPrice: parseFloat(data.LAST_UPDATED_PRICE),
      totalTrades: parseInt(data.TOTAL_TRADES),
      averageTradedPrice: parseFloat(data.AVERAGE_TRADED_PRICE),
      marketCap: parseFloat(data.MARKET_CAPITALIZATION),
    }
  }
}
