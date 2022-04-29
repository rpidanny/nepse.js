/* eslint-disable @typescript-eslint/no-explicit-any */
import { Got } from 'got'
import fs from 'fs/promises'
import csv from 'csvtojson'
import { INepse } from './interfaces'
import { StockDetails } from './types'

export class Nepse implements INepse {
  private readonly endpoint = 'https://newweb.nepalstock.com/api/nots/market/export/todays-price/'

  private parsingOptions = {
    delimiter: ',',
    quote: '"',
    trim: true,
    flatKeys: true,
  }

  constructor(private got: Got) {}

  async getRawCsv(date: string): Promise<string> {
    const { statusCode, body } = await this.got.get(`${this.endpoint}${date}`, {
      https: { rejectUnauthorized: false },
      throwHttpErrors: false,
    })

    if (statusCode === 200) {
      return body
    }

    throw new Error(`Unable to fetch data. Received StatusCode: ${statusCode}`)
  }

  async downloadCsv(date: string, path: string): Promise<void> {
    const rawCsv = await this.getRawCsv(date)

    await fs.writeFile(`${path}/${date}.csv`, rawCsv)
  }

  async getDetails(date: string): Promise<StockDetails[]> {
    const rawCsv = await this.getRawCsv(date)

    let parsedData = await csv(this.parsingOptions).fromString(rawCsv)

    parsedData = parsedData.map((d) => this.transformData(d))

    return parsedData
  }

  transformData(data: Record<string, any>): StockDetails {
    return {
      serialNumber: parseInt(data['S.N'], 10),
      businessDate: data.BUSINESS_DATE,
      securityId: parseInt(data.SECURITY_ID, 10),
      symbol: data.SYMBOL,
      securityName: data.SECURITY_NAME,
      openPrice: parseInt(data.OPEN_PRICE, 10),
      highPrice: parseInt(data.HIGH_PRICE, 10),
      lowPrice: parseInt(data.LOW_PRICE, 10),
      closePrice: parseInt(data.CLOSE_PRICE, 10),
      totalTradedQuantity: parseInt(data.TOTAL_TRADED_QUANTITY, 10),
      totalTradedValue: parseInt(data.TOTAL_TRADED_VALUE, 10),
      previousDayClosePrice: parseInt(data.PREVIOUS_DAY_CLOSE_PRICE, 10),
      fiftyTwoWeekHigh: parseInt(data.FIFTY_TWO_WEEKS_HIGH, 10),
      fiftyTwoWeekLow: parseInt(data.FIFTY_TWO_WEEKS_LOW, 10),
      lastUpdatedTime: data.LAST_UPDATED_TIME,
      lastUpdatedPrice: parseInt(data.LAST_UPDATED_PRICE, 10),
      totalTrades: parseInt(data.TOTAL_TRADES, 10),
      averageTradedPrice: parseInt(data.AVERAGE_TRADED_PRICE, 10),
      marketCap: parseInt(data.MARKET_CAPITALIZATION, 10),
    }
  }
}
