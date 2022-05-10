import got, { RequestError } from 'got'
import nock from 'nock'

import { INepse, Nepse } from '../../src/nepse'
import { UnexpectedUpstreamResponseError } from '../../src/nepse/errors'
import {
  getMockAccessToken,
  getMockAuthenticateResponse,
  getMockFloorSheetResponse,
  getMockTodaysPricesExportResponse,
  getSecuritiesResponse,
  getSecurityHistoryResponse,
} from '../factory'

describe('Nepse', () => {
  const date = '2019-10-21'
  const baseUrl = 'https://newweb.nepalstock.com/api'

  let nepse: INepse

  beforeAll(() => {
    nepse = new Nepse(got)
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

  describe('Unauthenticated request', () => {
    describe('authenticate', () => {
      it('should authenticate and get tokens', async () => {
        nock(baseUrl).get(`/authenticate/prove`).reply(200, getMockAuthenticateResponse())

        const resp = await nepse.authenticate()

        expect(resp).toStrictEqual(getMockAuthenticateResponse())
      })

      it.each`
        statusCode | errorClass                         | errorClassName                       | retryCount
        ${201}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${204}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${400}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${401}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${419}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${500}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
        ${503}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
      `(
        'should throw $errorClassName error when API returns $statusCode',
        async ({ statusCode, errorClass, retryCount }) => {
          nock(baseUrl)
            .get(`/authenticate/prove`)
            .times(retryCount + 1)
            .reply(statusCode)

          await expect(nepse.authenticate()).rejects.toThrow(errorClass)
        },
      )
    })

    describe('getTodaysPricesExport', () => {
      it('should fetch todays price export as csv string', async () => {
        nock(baseUrl)
          .get(`/nots/market/export/todays-price/${date}`)
          .reply(200, getMockTodaysPricesExportResponse())

        const csv = await nepse.getTodaysPricesExport(date)

        expect(csv).toStrictEqual(getMockTodaysPricesExportResponse())
      })

      it.each`
        statusCode | errorClass                         | errorClassName                       | retryCount
        ${201}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${204}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${400}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${401}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${419}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${500}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
        ${503}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
      `(
        'should throw $errorClassName error when API returns $statusCode',
        async ({ statusCode, errorClass, retryCount }) => {
          nock(baseUrl)
            .get(`/nots/market/export/todays-price/${date}`)
            .times(retryCount + 1)
            .reply(statusCode)

          await expect(nepse.getTodaysPricesExport(date)).rejects.toThrow(errorClass)
        },
      )
    })
  })

  describe('Authenticated Requests', () => {
    beforeEach(() => {
      nock(baseUrl).get(`/authenticate/prove`).reply(200, getMockAuthenticateResponse())
    })

    describe('getFloorSheet', () => {
      const defaultPage = 0
      const defaultSize = 500

      it('should fetch floorsheet as JSON object', async () => {
        nock(baseUrl)
          .post(
            `/nots/nepse-data/floorsheet?&sort=contractId,desc&size=${defaultSize}&page=${defaultPage}`,
            { id: 249 },
          )
          .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
          .reply(200, getMockFloorSheetResponse())

        await expect(nepse.getFloorSheet()).resolves.toEqual(getMockFloorSheetResponse())
      })

      it('should fetch floorsheet with custom page and size', async () => {
        const page = 20
        const size = 300
        nock(baseUrl)
          .post(`/nots/nepse-data/floorsheet?&sort=contractId,desc&size=${size}&page=${page}`, {
            id: 249,
          })
          .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
          .reply(200, getMockFloorSheetResponse())

        await expect(nepse.getFloorSheet(page, size)).resolves.toEqual(getMockFloorSheetResponse())
      })

      /*

      */

      it.each`
        statusCode | errorClass                         | errorClassName                       | retryCount
        ${201}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${204}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${400}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${401}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${419}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${500}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
        ${503}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
      `(
        'should throw  $errorClassName error when API returns $statusCode',
        async ({ statusCode, errorClass, retryCount }) => {
          nock.cleanAll()

          nock(baseUrl)
            .get(`/authenticate/prove`)
            .times(retryCount + 1)
            .reply(200, getMockAuthenticateResponse())

          nock(baseUrl)
            .post(
              `/nots/nepse-data/floorsheet?&sort=contractId,desc&size=${defaultSize}&page=${defaultPage}`,
              { id: 249 },
            )
            .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
            .times(retryCount + 1)
            .reply(statusCode)

          await expect(nepse.getFloorSheet()).rejects.toBeInstanceOf(errorClass)
        },
      )
    })

    describe('getSecurities', () => {
      const defaultIncludeDelisted = false

      it('should securities as JSON array', async () => {
        nock(baseUrl)
          .get(`/nots/security?nonDelisted=${!defaultIncludeDelisted}`)
          .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
          .reply(200, getSecuritiesResponse())

        await expect(nepse.getSecurities()).resolves.toEqual(getSecuritiesResponse())
      })

      it('should fetch floorsheet with custom page and size', async () => {
        const includeDelisted = true

        nock(baseUrl)
          .get(`/nots/security?nonDelisted=${!includeDelisted}`)
          .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
          .reply(200, getSecuritiesResponse())

        await expect(nepse.getSecurities(includeDelisted)).resolves.toEqual(getSecuritiesResponse())
      })

      it.each`
        statusCode | errorClass                         | errorClassName                       | retryCount
        ${201}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${204}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${400}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${401}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${419}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${500}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
        ${503}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
      `(
        'should throw $errorClassName error when API returns $statusCode',
        async ({ statusCode, errorClass, retryCount }) => {
          nock.cleanAll()

          nock(baseUrl)
            .get(`/authenticate/prove`)
            .times(retryCount + 1)
            .reply(200, getMockAuthenticateResponse())

          nock(baseUrl)
            .get(`/nots/security?nonDelisted=${!defaultIncludeDelisted}`)
            .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
            .times(retryCount + 1)
            .reply(statusCode)

          await expect(nepse.getSecurities()).rejects.toBeInstanceOf(errorClass)
        },
      )
    })

    describe('getSecurityHistory', () => {
      const defaultPage = 0
      const defaultSize = 500
      const securityId = 131

      const startDate = '2019-10-19'
      const endDate = '2019-10-21'

      it('should securities as JSON array', async () => {
        nock(baseUrl)
          .get(
            `/nots/market/history/security/${securityId}?&page=${defaultPage}&size=${defaultSize}&startDate=${startDate}&endDate=${endDate}`,
          )
          .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
          .reply(200, getSecurityHistoryResponse())

        await expect(nepse.getSecurityHistory(securityId, startDate, endDate)).resolves.toEqual(
          getSecurityHistoryResponse(),
        )
      })

      it('should fetch security histories with custom page and size', async () => {
        const page = 1
        const size = 200

        nock(baseUrl)
          .get(
            `/nots/market/history/security/${securityId}?&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
          )
          .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
          .reply(200, getSecurityHistoryResponse())

        await expect(
          nepse.getSecurityHistory(securityId, startDate, endDate, page, size),
        ).resolves.toEqual(getSecurityHistoryResponse())
      })

      it.each`
        statusCode | errorClass                         | errorClassName                       | retryCount
        ${201}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${204}     | ${UnexpectedUpstreamResponseError} | ${'UnexpectedUpstreamResponseError'} | ${0}
        ${400}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${401}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${419}     | ${RequestError}                    | ${'RequestError'}                    | ${0}
        ${500}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
        ${503}     | ${RequestError}                    | ${'RequestError'}                    | ${2}
      `(
        'should throw $errorClassName error when API returns $statusCode',
        async ({ statusCode, errorClass, retryCount }) => {
          nock.cleanAll()

          nock(baseUrl)
            .get(`/authenticate/prove`)
            .times(retryCount + 1)
            .reply(200, getMockAuthenticateResponse())

          nock(baseUrl)
            .get(
              `/nots/market/history/security/${securityId}?&page=${defaultPage}&size=${defaultSize}&startDate=${startDate}&endDate=${endDate}`,
            )
            .matchHeader('authorization', `Salter ${getMockAccessToken()}`)
            .times(retryCount + 1)
            .reply(statusCode)

          await expect(
            nepse.getSecurityHistory(securityId, startDate, endDate),
          ).rejects.toBeInstanceOf(errorClass)
        },
      )
    })
  })

  describe('patchAccessToken', () => {
    it('should correctly patch the accessToken', () => {
      const { accessToken } = getMockAuthenticateResponse()

      expect(nepse.patchAccessToken(accessToken)).toEqual(getMockAccessToken())
    })
  })
})
