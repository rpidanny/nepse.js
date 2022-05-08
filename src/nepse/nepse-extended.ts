/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-explicit-any */
import csv from 'csvtojson'
import fs from 'fs/promises'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import { Parser as Json2CsvParser } from 'json2csv'

import { INepse, INepseExtended } from './interfaces'
import { TDailyFloorSheet, TDailyStockPrice, TFloorSheet } from './types'

export class NepseExtended implements INepseExtended {
  private parsingOptions = {
    delimiter: ',',
    quote: '"',
    trim: true,
    flatKeys: true,
  }

  constructor(private readonly nepse: INepse) {}

  async getTodaysPricesExport(date: string): Promise<TDailyStockPrice[]> {
    const csvData = await this.nepse.getTodaysPricesExport(date)

    let parsedData = await csv(this.parsingOptions).fromString(csvData)

    parsedData = parsedData.map((d) => this.transformData(d))

    return parsedData
  }

  async downloadTodaysPriceExportToCsv(date: string, path: string): Promise<string> {
    const filePath = `${path}/${date}.csv`

    const csvData = await this.nepse.getTodaysPricesExport(date)
    await fs.writeFile(filePath, csvData)

    return filePath
  }

  transformData(data: Record<string, any>): TDailyStockPrice {
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

  async getFloorSheet(): Promise<TDailyFloorSheet> {
    const {
      totalAmount,
      totalQty,
      totalTrades,
      floorsheets: { totalPages, content },
    } = await this.nepse.getFloorSheet()

    let floorSheets: TFloorSheet[] = [...content]

    for (let pageNumber = 1; pageNumber < totalPages; pageNumber++) {
      const {
        floorsheets: { content },
      } = await this.nepse.getFloorSheet(pageNumber)

      floorSheets = floorSheets.concat(content)
    }

    return {
      totalAmount,
      totalQty,
      totalTrades,
      floorSheets,
    }
  }

  async downloadFloorSheetsToCsv(path: string): Promise<string> {
    const filePath = `${path}/${new Date().toISOString()}.csv`

    const { floorSheets } = await this.getFloorSheet()

    const jsonParser = new Json2CsvParser()
    const csvData = jsonParser.parse(floorSheets)

    await fs.writeFile(filePath, csvData)

    return filePath
  }
}
