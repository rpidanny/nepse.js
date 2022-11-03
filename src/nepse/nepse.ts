import { Response } from 'got'

import { GenericClient } from '../utils/generic-client'
import { UnexpectedUpstreamResponseError } from './errors'
import { INepse } from './interfaces'
import {
  TAuthenticateResponse,
  TGetFloorSheetResponse,
  TGetSecuritiesResponse,
  TGetSecurityHistoryResponse,
} from './types'

export class Nepse extends GenericClient implements INepse {
  protected readonly upstreamName = 'nepse'
  protected readonly endpoint = 'https://newweb.nepalstock.com/api'

  protected async getAuthHeader(): Promise<string> {
    const { accessToken } = await this.authenticate()
    const token = this.patchAccessToken(accessToken)
    return `Salter ${token}`
  }

  private handleResponse<T>(response: Response<T>, expectedStatusCode = 200): T {
    const { statusCode, body } = response

    if (expectedStatusCode === statusCode) {
      return body
    }

    throw new UnexpectedUpstreamResponseError(this.upstreamName, statusCode, body)
  }

  patchAccessToken(token: string): string {
    const bodyPrefix = 'eyJpc3MiOiJ5Y28iLCJzdWIiOiIxMiIsImlhdCI6M'

    const temp = token.split('.')

    const bodySuffix = temp[1].slice(bodyPrefix.length + 2)

    return `${temp[0]}.${bodyPrefix}${bodySuffix}.${temp[2]}`
  }

  async authenticate(): Promise<TAuthenticateResponse> {
    const res = await this.call<TAuthenticateResponse>('get', 'authenticate/prove', {})

    return this.handleResponse(res)
  }

  // TODO: Replce with API Call
  async getTodaysPricesExport(date: string): Promise<string> {
    const res = await this.call<string>('get', `nots/market/export/todays-price/${date}`, {
      responseType: undefined,
    })

    return this.handleResponse(res)
  }

  async getFloorSheet(page = 0, size = 500): Promise<TGetFloorSheetResponse> {
    const res = await this.callWithAuth<TGetFloorSheetResponse>(
      'post',
      `nots/nepse-data/floorsheet?&sort=contractId,desc&size=${size}&page=${page}`,
      {
        json: { id: 243 },
        retry: {
          methods: ['POST'],
        },
      },
    )

    return this.handleResponse(res)
  }

  async getSecurities(includeDelisted = false): Promise<TGetSecuritiesResponse[]> {
    const res = await this.callWithAuth<TGetSecuritiesResponse[]>(
      'get',
      `nots/security?nonDelisted=${!includeDelisted}`,
      {},
    )

    return this.handleResponse(res)
  }

  async getSecurityHistory(
    securityId: number,
    startDate: string,
    endDate: string,
    page = 0,
    size = 500,
  ): Promise<TGetSecurityHistoryResponse> {
    const res = await this.callWithAuth<TGetSecurityHistoryResponse>(
      'get',
      `nots/market/history/security/${securityId}?&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
    )

    return this.handleResponse<TGetSecurityHistoryResponse>(res)
  }
}
