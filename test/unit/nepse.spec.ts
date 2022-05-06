import got from 'got'
import nock from 'nock'
import tmp from 'tmp-promise'
import fs from 'fs/promises'

import { INepse, Nepse } from '../../src'

import { getRawCsvResponse, getParsedDetails } from '../factory/nepse'

describe('Nepse', () => {
  const date = '2019-10-21'
  const baseUrl = 'https://newweb.nepalstock.com/api/nots/market/export/todays-price/'
  let nepse: INepse

  beforeAll(() => {
    nepse = new Nepse(
      got.extend({
        retry: {
          calculateDelay: ({ computedValue }) => computedValue / 5,
        },
      }),
    )
  })

  beforeEach(async () => {
    nock.abortPendingRequests()
    nock.cleanAll()
    nock.disableNetConnect()
  })

  afterEach(() => {
    const pending = nock.pendingMocks()

    if (pending.length > 0) {
      console.log('Pending Nocks: ', pending)
      throw new Error(`${pending.length} mocks are pending!`)
    }

    nock.enableNetConnect()
  })

  describe('getTodaysPricesRaw', () => {
    it('should fetch raw csv from API', async () => {
      nock(baseUrl).get(`/${date}`).reply(200, getRawCsvResponse())

      const csv = await nepse.getTodaysPricesRaw(date)

      expect(csv).toStrictEqual(getRawCsvResponse())
    })

    it.each`
      statusCode | retryCount
      ${401}     | ${0}
      ${419}     | ${0}
      ${500}     | ${2}
      ${503}     | ${2}
    `('should throw error when API returns $statusCode', async ({ statusCode, retryCount }) => {
      nock(baseUrl)
        .get(`/${date}`)
        .times(retryCount + 1)
        .reply(statusCode)

      await expect(nepse.getTodaysPricesRaw(date)).rejects.toThrow(
        new Error(`Unable to fetch data. Received StatusCode: ${statusCode}`),
      )
    })
  })

  describe('getTodaysPrices', () => {
    it('should get correct details', async () => {
      nock(baseUrl).get(`/${date}`).reply(200, getRawCsvResponse())

      const details = await nepse.getTodaysPrices(date)

      expect(details).toStrictEqual(getParsedDetails())
    })

    it.each`
      statusCode | retryCount
      ${401}     | ${0}
      ${419}     | ${0}
      ${500}     | ${2}
      ${503}     | ${2}
    `('should throw error when API returns $statusCode', async ({ statusCode, retryCount }) => {
      nock(baseUrl)
        .get(`/${date}`)
        .times(retryCount + 1)
        .reply(statusCode)

      await expect(nepse.getTodaysPrices(date)).rejects.toThrowError()
    })
  })

  describe('downloadCsv', () => {
    it('should download csv file', async () => {
      expect.assertions(1)

      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nock(baseUrl).get(`/${date}`).reply(200, getRawCsvResponse())

      await nepse.downloadCsv(date, path)

      const writtenCsv = await fs.readFile(`${path}/${date}.csv`, 'utf-8')

      expect(writtenCsv).toStrictEqual(getRawCsvResponse())

      await cleanup()
    })

    it("should throw error when dir doesn't exist", async () => {
      expect.assertions(1)

      const { path, cleanup } = await tmp.dir({ unsafeCleanup: true })

      nock(baseUrl).get(`/${date}`).reply(200, getRawCsvResponse())

      await expect(nepse.downloadCsv(date, `${path}/some-extra-path`)).rejects.toThrowError()

      await cleanup()
    })
  })
})
