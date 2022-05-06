import { TTodaysPrice } from './types'
export interface INepse {
  getTodaysPricesRaw(date: string): Promise<string>

  downloadCsv(date: string, path: string): Promise<void>

  getTodaysPrices(date: string): Promise<TTodaysPrice[]>
}
