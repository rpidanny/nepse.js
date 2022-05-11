import { TFloorSheet, TSecurityHistoryItem } from './nepse'

export type TDailyStockPrice = {
  serialNumber: number
  businessDate: string
  securityId: number
  symbol: string
  securityName: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  totalTradedQuantity: number
  totalTradedValue: number
  previousDayClosePrice: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  lastUpdatedTime: string
  lastUpdatedPrice: number
  totalTrades: number
  averageTradedPrice: number
  marketCap: number
}

export type TDailyFloorSheet = {
  totalAmount: number
  totalQty: number
  totalTrades: number
  floorSheets: TFloorSheet[]
}

export type TSecurityHistory = TSecurityHistoryItem[]
