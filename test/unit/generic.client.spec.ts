/* eslint-disable arrow-parens */
import got from 'got'
import nock from 'nock'

import { GotInstanceInitializationError, IGenericClient } from '../../src/utils/generic-client'
import { TestGenericClient } from '../factory'

describe('GenericClient', () => {
  let genericClient: IGenericClient

  beforeEach(async () => {
    nock.abortPendingRequests()
    nock.cleanAll()
    nock.disableNetConnect()

    genericClient = new TestGenericClient(got)
  })

  afterEach(() => {
    const pending = nock.pendingMocks()

    if (pending.length > 0) {
      console.log('Pending Nocks: ', pending)
      throw new Error(`${pending.length} mocks are pending!`)
    }

    nock.enableNetConnect()
  })

  describe('getGotInstance', () => {
    it('should get the same got instance on multiple calls', async () => {
      const instance1 = await genericClient.getGotInstance()
      const instance2 = await genericClient.getGotInstance()

      expect(instance1).toStrictEqual(instance2)
    })

    // it.only('should configure got with proper defauls', async () => {
    //   const gotInstance = await genericClient.getGotInstance()

    //   const {
    //     defaults: {
    //       options: { retry },
    //     },
    //   } = gotInstance

    //   console.log(retry)

    //   // expect(retry).toEqual({})
    // })
  })

  describe('getGotInstanceWithAuth', () => {
    it('should get the same got instance on multiple calls', async () => {
      const instance1 = await genericClient.getGotInstanceWithAuth()
      const instance2 = await genericClient.getGotInstanceWithAuth()

      expect(instance1).toStrictEqual(instance2)
    })

    it('should add Authorization header', async () => {
      nock('https://some.website')
        .get('/some-path')
        .matchHeader('authorization', 'some-header')
        .reply(200, { data: 'ok' })

      const { statusCode, body } = await genericClient.callWithAuth('get', 'some-path')

      expect(body).toEqual({ data: 'ok' })
      expect(statusCode).toEqual(200)
    })

    it('should add Authorization header with options.headers is undefined', async () => {
      nock('https://some.website')
        .get('/some-path')
        .matchHeader('authorization', 'some-header')
        .reply(200, { data: 'ok' })

      const { statusCode, body } = await genericClient.callWithAuth('get', 'some-path', {
        headers: undefined,
      })

      expect(body).toEqual({ data: 'ok' })
      expect(statusCode).toEqual(200)
    })
  })

  describe('call', () => {
    it('should make http request', async () => {
      nock('https://some.website').get('/some-path').reply(200, { data: 'ok' })

      const { statusCode, body } = await genericClient.call('get', 'some-path')

      expect(body).toEqual({ data: 'ok' })
      expect(statusCode).toEqual(200)
    })

    it.each([408, 429, 500, 502, 503, 504, 521, 522, 524])(
      'should retry for statysCode %i',
      async (errorStatusCode) => {
        nock('https://some.website').get('/some-path').times(2).reply(errorStatusCode)
        nock('https://some.website').get('/some-path').reply(200, { data: 'ok' })

        const { statusCode, body } = await genericClient.call('get', 'some-path')

        expect(body).toEqual({ data: 'ok' })
        expect(statusCode).toEqual(200)
      },
    )

    it('should throw GotInstanceInitializationError when failed to get got instance', async () => {
      const getGotInstanceSpy = jest.spyOn(genericClient, 'getGotInstance')
      getGotInstanceSpy.mockImplementationOnce(() => {
        throw new Error('Some Error')
      })

      await expect(genericClient.call('get', 'some-path')).rejects.toThrowError(
        GotInstanceInitializationError,
      )
    })
  })

  describe('callWithAuth', () => {
    it('should make http request', async () => {
      nock('https://some.website')
        .get('/some-path')
        .matchHeader('authorization', 'some-header')
        .reply(200, { data: 'ok' })

      const { statusCode, body } = await genericClient.callWithAuth('get', 'some-path', {
        headers: undefined,
      })

      expect(body).toEqual({ data: 'ok' })
      expect(statusCode).toEqual(200)
    })

    it.each([408, 429, 500, 502, 503, 504, 521, 522, 524])(
      'should retry for statysCode %i',
      async (errorStatusCode) => {
        nock('https://some.website')
          .get('/some-path')
          .matchHeader('authorization', 'some-header')
          .reply(errorStatusCode)

        nock('https://some.website')
          .get('/some-path')
          .matchHeader('authorization', 'some-header')
          .reply(200, { data: 'ok' })

        const { statusCode, body } = await genericClient.callWithAuth('get', 'some-path')

        expect(body).toEqual({ data: 'ok' })
        expect(statusCode).toEqual(200)
      },
    )

    it('should throw GotInstanceInitializationError when failed to get got instance', async () => {
      const getGotInstanceWithAuthSpy = jest.spyOn(genericClient, 'getGotInstanceWithAuth')
      getGotInstanceWithAuthSpy.mockImplementationOnce(() => {
        throw new Error('Some Error')
      })

      await expect(genericClient.callWithAuth('get', 'some-path')).rejects.toThrowError(
        GotInstanceInitializationError,
      )
    })
  })
})
