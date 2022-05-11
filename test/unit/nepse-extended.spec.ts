/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-parens */
import fs from 'fs/promises'
import { mock } from 'jest-mock-extended'
import tmp from 'tmp-promise'

import { INepseExtended, Nepse, NepseExtended } from '../../src'
import { TSecurityHistory } from '../../src/nepse'
import {
  getMockDailyFloorSheet,
  getMockDailyFloorSheetCsvExport,
  getMockDailyStockPrices,
  getMockFloorSheetResponse,
  getMockSecurityHistory,
  getMockSecurityHistoryResponse,
  getMockTodaysPricesExportResponse,
} from '../factory'

describe('Nepse', () => {
  const date = '2019-10-21'
  const nepse = mock<Nepse>()

  let nepseExtended: INepseExtended

  beforeAll(() => {
    nepseExtended = new NepseExtended(nepse)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('getTodaysPricesExport', () => {
    it.each`
      nepseResponse                          | expectedResponse             | description
      ${getMockTodaysPricesExportResponse()} | ${getMockDailyStockPrices()} | ${'valid csv string'}
      ${'some-string'}                       | ${[]}                        | ${'non cvs string'}
      ${''}                                  | ${[]}                        | ${'empty string'}
    `(
      'should get expected stock prices when $description',
      async ({ nepseResponse, expectedResponse }) => {
        nepse.getTodaysPricesExport.mockImplementationOnce(async (_date) => {
          return nepseResponse
        })

        const stockPrices = await nepseExtended.getTodaysPricesExport(date)

        expect(stockPrices).toStrictEqual(expectedResponse)
      },
    )

    it('should throw an error when nepse throws error', async () => {
      nepse.getTodaysPricesExport.mockImplementationOnce(async (_date) => {
        throw new Error('Some Error')
      })

      await expect(nepseExtended.getTodaysPricesExport(date)).rejects.toThrow(Error)
    })
  })

  describe('downloadTodaysPriceToCsv', () => {
    it('should download csv file', async () => {
      expect.assertions(1)
      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nepse.getTodaysPricesExport.mockImplementationOnce(async (_date) => {
        return getMockTodaysPricesExportResponse()
      })

      const filePath = await nepseExtended.downloadTodaysPriceExportToCsv(date, path)

      const writtenCsv = await fs.readFile(filePath, 'utf-8')

      expect(writtenCsv).toStrictEqual(getMockTodaysPricesExportResponse())

      await cleanup()
    })

    it("should throw error when dir doesn't exist", async () => {
      expect.assertions(1)
      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nepse.getTodaysPricesExport.mockImplementationOnce(async (_date) => {
        return getMockTodaysPricesExportResponse()
      })

      await expect(
        nepseExtended.downloadTodaysPriceExportToCsv(date, `${path}/some-extra-path`),
      ).rejects.toThrowError()

      await cleanup()
    })

    it('should throw error nepse throws an error', async () => {
      expect.assertions(1)
      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nepse.getTodaysPricesExport.mockImplementationOnce(async (_date) => {
        throw new Error('Some Error')
      })

      await expect(nepseExtended.downloadTodaysPriceExportToCsv(date, path)).rejects.toThrowError()

      await cleanup()
    })
  })

  describe('getFloorSheet', () => {
    it('should get floorsheet', async () => {
      nepse.getFloorSheet.mockImplementationOnce(async () => {
        return getMockFloorSheetResponse()
      })

      await expect(nepseExtended.getFloorSheet()).resolves.toStrictEqual(getMockDailyFloorSheet())
    })

    it.each`
      totalPages
      ${2}
      ${50}
    `('should get floorsheet with $totalPages pages', async ({ totalPages }) => {
      const mockFloorSheet = getMockDailyFloorSheet()

      const floorSheets = []

      for (let i = 0; i < totalPages; i++) {
        nepse.getFloorSheet.mockImplementationOnce(async () => {
          return getMockFloorSheetResponse({ totalPages })
        })
        floorSheets.push(mockFloorSheet.floorSheets[0])
      }

      const expectedResponse = {
        ...mockFloorSheet,
        floorSheets,
      }

      await expect(nepseExtended.getFloorSheet()).resolves.toStrictEqual(expectedResponse)
      expect(nepse.getFloorSheet).toHaveBeenCalledTimes(totalPages)
    })

    it('should throw an error when nepse throws error', async () => {
      nepse.getFloorSheet.mockImplementationOnce(async () => {
        throw new Error('Some Error')
      })

      await expect(nepseExtended.getFloorSheet()).rejects.toThrow(Error)
    })
  })

  describe('downloadFloorSheetsToCsv', () => {
    it('should download floorsheet into a csv file', async () => {
      expect.assertions(1)
      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nepse.getFloorSheet.mockImplementationOnce(async () => {
        return getMockFloorSheetResponse()
      })

      const filePath = await nepseExtended.downloadFloorSheetsToCsv(path)

      const writtenCsv = await fs.readFile(filePath, 'utf-8')

      expect(writtenCsv).toStrictEqual(getMockDailyFloorSheetCsvExport())

      await cleanup()
    })

    it("should throw error when dir doesn't exist", async () => {
      expect.assertions(1)
      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nepse.getFloorSheet.mockImplementationOnce(async () => {
        return getMockFloorSheetResponse()
      })

      await expect(
        nepseExtended.downloadFloorSheetsToCsv(`${path}/some-extra-path`),
      ).rejects.toThrowError()

      await cleanup()
    })

    it('should throw error nepse throws an error', async () => {
      expect.assertions(1)
      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nepse.getFloorSheet.mockImplementationOnce(async () => {
        throw new Error('Some Error')
      })

      await expect(nepseExtended.downloadFloorSheetsToCsv(path)).rejects.toThrowError()

      await cleanup()
    })
  })

  describe('getSecurityHistory', () => {
    const securityId = 125
    const startDate = '2019-10-19'
    const endDate = '2019-10-21'

    it('should get security history', async () => {
      nepse.getSecurityHistory.mockImplementationOnce(async () => {
        return getMockSecurityHistoryResponse()
      })

      await expect(
        nepseExtended.getSecurityHistory(securityId, startDate, endDate),
      ).resolves.toStrictEqual(getMockSecurityHistory())
    })

    it.each`
      totalPages
      ${2}
      ${50}
    `('should get security history with $totalPages pages', async ({ totalPages }) => {
      const mockSecurityHistory = getMockSecurityHistory()

      let securityHistories: TSecurityHistory = []

      for (let i = 0; i < totalPages; i++) {
        nepse.getSecurityHistory.mockImplementationOnce(async () => {
          // we can always return the same totalPages cuz we only check totalPages once in the first request
          return getMockSecurityHistoryResponse({ totalPages })
        })
        securityHistories = securityHistories.concat(mockSecurityHistory)
      }

      await expect(
        nepseExtended.getSecurityHistory(securityId, startDate, endDate),
      ).resolves.toStrictEqual(securityHistories)
      expect(nepse.getSecurityHistory).toHaveBeenCalledTimes(totalPages)
    })

    it('should throw an error when nepse throws error', async () => {
      nepse.getSecurityHistory.mockImplementationOnce(async () => {
        throw new Error('Some Error')
      })

      await expect(
        nepseExtended.getSecurityHistory(securityId, startDate, endDate),
      ).rejects.toThrow(Error)
    })
  })
})
