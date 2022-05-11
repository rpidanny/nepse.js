import {
  ExtendOptions,
  Got,
  HTTPAlias,
  OptionsOfJSONResponseBody,
  RequiredRetryOptions,
  Response,
} from 'got'
import { Delays } from 'got/dist/source/core/utils/timed-out'

import { GotInstanceInitializationError } from './errors'
import { IGenericClient } from './interfaces'

export abstract class GenericClient implements IGenericClient {
  protected abstract readonly endpoint: string

  private gotInstance!: Got
  private gotInstanceWithAuth!: Got

  constructor(private got: Got) {}

  private getBaseGotConfig(): ExtendOptions {
    return {
      prefixUrl: this.endpoint,
      responseType: 'json',
      // throwHttpErrors: false,
      timeout: this.getTimeoutConfig(),
      retry: this.getRetryConfig(),
      https: { rejectUnauthorized: false },
    }
  }

  protected async getAuthHeader(): Promise<string> {
    return 'some-header'
  }

  private async addAuthorizationHeader(options: ExtendOptions): Promise<void> {
    const authHeader = await this.getAuthHeader()

    /* istanbul ignore next */
    if (options.headers) {
      options.headers[`Authorization`] = authHeader
    } else {
      options.headers = {
        Authorization: authHeader,
      }
    }
  }

  async getGotInstance(): Promise<Got> {
    if (!this.gotInstance) {
      this.gotInstance = this.got.extend(this.getBaseGotConfig())
    }

    return this.gotInstance
  }

  async getGotInstanceWithAuth(): Promise<Got> {
    if (!this.gotInstanceWithAuth) {
      this.gotInstanceWithAuth = this.got.extend({
        ...this.getBaseGotConfig(),
        hooks: {
          beforeRequest: [this.addAuthorizationHeader.bind(this)],
          // TODO: create logger extension
          // beforeRetry: [
          //   (_options, _error, retryCount) => {
          //     console.log(`Retrying for the ${retryCount} time`)
          //   },
          // ],
        },
      })
    }

    return this.gotInstanceWithAuth
  }

  async call<T>(
    method: HTTPAlias,
    url: string,
    options: OptionsOfJSONResponseBody = {},
  ): Promise<Response<T>> {
    try {
      const instance = await this.getGotInstance()

      return instance[method]<T>(url, options)
    } catch (error) {
      throw new GotInstanceInitializationError(error as Error)
    }
  }

  async callWithAuth<T>(
    method: HTTPAlias,
    url: string,
    options: OptionsOfJSONResponseBody = {},
  ): Promise<Response<T>> {
    try {
      const instance = await this.getGotInstanceWithAuth()
      return instance[method]<T>(url, options)
    } catch (error) {
      throw new GotInstanceInitializationError(error as Error)
    }
  }

  protected getTimeoutConfig(): Delays | number {
    return {
      connect: 1000,
      request: 7000,
      response: 5000,
    }
  }

  protected getRetryConfig(): undefined | Partial<RequiredRetryOptions> | number {
    return {
      calculateDelay: ({ computedValue }) => computedValue / 5,
      limit: 2,
    }
  }
}
