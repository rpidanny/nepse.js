import { StockDetails } from '../../src'

export const getRawCsvResponse = (): string => {
  return `S.N,BUSINESS_DATE,SECURITY_ID,SYMBOL,SECURITY_NAME,OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,TOTAL_TRADED_QUANTITY,TOTAL_TRADED_VALUE,PREVIOUS_DAY_CLOSE_PRICE,FIFTY_TWO_WEEKS_HIGH,FIFTY_TWO_WEEKS_LOW,LAST_UPDATED_TIME,LAST_UPDATED_PRICE,TOTAL_TRADES,AVERAGE_TRADED_PRICE,MARKET_CAPITALIZATION
  1,2021-04-29,133,SCB,Standard Chartered Bank Limited,582.0000,582.0000,575.0000,580.0000,23264,13487901.0000,582.0000,754.0000,505.0000,2021-04-29T14:59:52.077966,580.0000,237,579.77,49718.94
  2,2021-04-29,142,KBL,Kumari Bank Limited,317.0000,319.0000,314.0000,314.0000,86121,27128974.0000,314.0000,345.0000,153.0000,2021-04-29T14:59:43.755454,314.0000,411,315.00,43578.41`
}

export const getRawJsonDetails = (): Record<string, string>[] => {
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

export const getParsedDetails = (): StockDetails[] => {
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
