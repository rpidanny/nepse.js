/* eslint-disable arrow-parens */
import { AppError } from '../../src/utils/errors'

describe('AppError', () => {
  it('should assign stack from provided error', () => {
    const providedErr = {
      stack: 'provided-stack',
      message: 'some message',
      name: 'provided-err',
    } as Error

    const appErrMsg = 'app err message'
    const appErr = new AppError({
      err: providedErr,
      code: 'CODE_VAL',
      message: appErrMsg,
    })

    expect(appErr.stack).toEqual(providedErr.stack)
    expect(appErr.message).toEqual(appErrMsg)
  })

  it('converts error to json when details are provided', () => {
    const errParams = {
      code: 'APP_ERR_CODE',
      message: 'message here',
      details: { detail: 'some details' },
    }

    const appErr = new AppError(errParams)

    const appErrJson = appErr.toJSON()
    expect(appErrJson.message).toEqual(errParams.message)
    expect(appErrJson.code).toEqual(errParams.code)
    expect(appErrJson.details).toEqual(errParams.details)
  })

  test.each([undefined])('converts error to json when details = %p', (errDetails) => {
    const errParams = {
      code: 'APP_ERR_CODE',
      message: 'message here',
      details: errDetails,
    }

    const appErr = new AppError(errParams)

    const appErrJson = appErr.toJSON()

    expect(appErrJson.message).toEqual(errParams.message)
    expect(appErrJson.code).toEqual(errParams.code)
    expect(appErrJson.details).toBeUndefined()
  })

  it('should correctly inherit from Error', () => {
    const errParams = {
      code: 'APP_ERR_CODE',
      message: 'message here',
    }

    const appErr = new AppError(errParams)

    expect(appErr).toBeInstanceOf(Error)
  })

  it('should correctly inherit from Error when no params are passed', () => {
    const appErr = new AppError()

    expect(appErr).toBeInstanceOf(Error)
  })
})
