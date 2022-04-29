import { StockDetails } from './types'
export interface INepse {
  getRawCsv(date: string): Promise<string>

  downloadCsv(date: string, path: string): Promise<void>

  getDetails(date: string): Promise<StockDetails[]>
}
