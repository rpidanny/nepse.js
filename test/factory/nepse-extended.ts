import { TDailyFloorSheet, TDailyStockPrice } from '../../src'

export const getMockDailyStockPricesRaw = (): Record<string, string>[] => {
  return [
    {
      'S.N': '1',
      BUSINESS_DATE: '2021-04-29',
      SECURITY_ID: '133',
      SYMBOL: 'SCB',
      SECURITY_NAME: 'Standard Chartered Bank Limited',
      OPEN_PRICE: '582.0000',
      HIGH_PRICE: '582.0000',
      LOW_PRICE: '575.0000',
      CLOSE_PRICE: '580.0000',
      TOTAL_TRADED_QUANTITY: '23264',
      TOTAL_TRADED_VALUE: '13487901.0000',
      PREVIOUS_DAY_CLOSE_PRICE: '582.0000',
      FIFTY_TWO_WEEKS_HIGH: '754.0000',
      FIFTY_TWO_WEEKS_LOW: '505.0000',
      LAST_UPDATED_TIME: '2021-04-29T14:59:52.077966',
      LAST_UPDATED_PRICE: '580.0000',
      TOTAL_TRADES: '237',
      AVERAGE_TRADED_PRICE: '579.77',
      MARKET_CAPITALIZATION: '49718.94',
    },
    {
      'S.N': '2',
      BUSINESS_DATE: '2021-04-29',
      SECURITY_ID: '142',
      SYMBOL: 'KBL',
      SECURITY_NAME: 'Kumari Bank Limited',
      OPEN_PRICE: '317.0000',
      HIGH_PRICE: '319.0000',
      LOW_PRICE: '314.0000',
      CLOSE_PRICE: '314.0000',
      TOTAL_TRADED_QUANTITY: '86121',
      TOTAL_TRADED_VALUE: '27128974.0000',
      PREVIOUS_DAY_CLOSE_PRICE: '314.0000',
      FIFTY_TWO_WEEKS_HIGH: '345.0000',
      FIFTY_TWO_WEEKS_LOW: '153.0000',
      LAST_UPDATED_TIME: '2021-04-29T14:59:43.755454',
      LAST_UPDATED_PRICE: '314.0000',
      TOTAL_TRADES: '411',
      AVERAGE_TRADED_PRICE: '315.00',
      MARKET_CAPITALIZATION: '43578.41',
    },
  ]
}

export const getMockDailyStockPrices = (): TDailyStockPrice[] => {
  return [
    {
      serialNumber: 1,
      businessDate: '2021-04-29',
      securityId: 133,
      symbol: 'SCB',
      securityName: 'Standard Chartered Bank Limited',
      openPrice: 582,
      highPrice: 582,
      lowPrice: 575,
      closePrice: 580,
      totalTradedQuantity: 23264,
      totalTradedValue: 13487901,
      previousDayClosePrice: 582,
      fiftyTwoWeekHigh: 754,
      fiftyTwoWeekLow: 505,
      lastUpdatedTime: '2021-04-29T14:59:52.077966',
      lastUpdatedPrice: 580,
      totalTrades: 237,
      averageTradedPrice: 579.77,
      marketCap: 49718.94,
    },
    {
      serialNumber: 2,
      businessDate: '2021-04-29',
      securityId: 142,
      symbol: 'KBL',
      securityName: 'Kumari Bank Limited',
      openPrice: 317,
      highPrice: 319,
      lowPrice: 314,
      closePrice: 314,
      totalTradedQuantity: 86121,
      totalTradedValue: 27128974,
      previousDayClosePrice: 314,
      fiftyTwoWeekHigh: 345,
      fiftyTwoWeekLow: 153,
      lastUpdatedTime: '2021-04-29T14:59:43.755454',
      lastUpdatedPrice: 314,
      totalTrades: 411,
      averageTradedPrice: 315,
      marketCap: 43578.41,
    },
  ]
}

export const getMockDailyFloorSheet = (
  overrides: Partial<TDailyFloorSheet> = {},
): TDailyFloorSheet => {
  return {
    totalAmount: 1654561472.54,
    totalQty: 4674940.0,
    totalTrades: 34260,
    floorSheets: [
      {
        id: null,
        contractId: 2022050504009912,
        contractType: null,
        stockSymbol: 'NICL',
        buyerMemberId: '1',
        sellerMemberId: '53',
        contractQuantity: 30,
        contractRate: 660.0,
        contractAmount: 19800.0,
        businessDate: '2022-05-05',
        tradeBookId: 63686114,
        stockId: 176,
        buyerBrokerName: 'Kumari Securities Private Limited',
        sellerBrokerName: 'Investment Management Nepal Pvt. Ltd.',
        tradeTime: '2022-05-05T14:59:59.962911',
        securityName: 'Nepal Insurance Co. Ltd.',
      },
    ],
    ...overrides,
  }
}

export const getDailyFloorSheetCsvExport = (): string => {
  return `"id","contractId","contractType","stockSymbol","buyerMemberId","sellerMemberId","contractQuantity","contractRate","contractAmount","businessDate","tradeBookId","stockId","buyerBrokerName","sellerBrokerName","tradeTime","securityName"
,2022050504009912,,"NICL","1","53",30,660,19800,"2022-05-05",63686114,176,"Kumari Securities Private Limited","Investment Management Nepal Pvt. Ltd.","2022-05-05T14:59:59.962911","Nepal Insurance Co. Ltd."`
}
