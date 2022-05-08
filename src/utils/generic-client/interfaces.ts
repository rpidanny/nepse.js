import { Got, HTTPAlias, OptionsOfJSONResponseBody, Response } from 'got'

export interface IGenericClient {
  getGotInstance(): Promise<Got>

  getGotInstanceWithAuth(): Promise<Got>

  call<T>(method: HTTPAlias, url: string, options?: OptionsOfJSONResponseBody): Promise<Response<T>>

  callWithAuth<T>(
    method: HTTPAlias,
    url: string,
    options?: OptionsOfJSONResponseBody,
  ): Promise<Response<T>>
}
