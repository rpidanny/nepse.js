export interface INepse {
  getRawCsv(date: string): Promise<string>

  downloadCsv(date: string, path: string): Promise<void>

  getDataFromNepseAlpha(
    ticker: string,
    startDate: string,
    endDate: string,
  ): Promise<Array<Record<string, string>>>

  getDailyPrice(date: string): Promise<string[]>
}
