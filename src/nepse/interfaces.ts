import {
  TAuthenticateResponse,
  TDailyFloorSheet,
  TDailyStockPrice,
  TGetFloorSheetResponse,
  TGetSecuritiesResponse,
  TGetSecurityHistoryResponse,
} from './types'

export interface INepseExtended {
  getTodaysPricesExport(date: string): Promise<TDailyStockPrice[]>

  downloadTodaysPriceExportToCsv(date: string, path: string): Promise<string>

  getFloorSheet(): Promise<TDailyFloorSheet>

  downloadFloorSheetsToCsv(path: string): Promise<string>
}

export interface INepse {
  patchAccessToken(token: string): string

  authenticate(): Promise<TAuthenticateResponse>

  getTodaysPricesExport(date: string): Promise<string>

  getFloorSheet(page?: number, size?: number): Promise<TGetFloorSheetResponse>

  getSecurities(includeDelisted?: boolean): Promise<TGetSecuritiesResponse[]>

  getSecurityHistory(
    securityId: number,
    startDate: string,
    endDate: string,
    page?: number,
    size?: number,
  ): Promise<TGetSecurityHistoryResponse>
}
