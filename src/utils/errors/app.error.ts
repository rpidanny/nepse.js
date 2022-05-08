import { TConstructorParams, TJsonPayload } from './'

export class AppError extends Error {
  public readonly code: string
  public readonly details?: Record<string, unknown>

  constructor({
    code = 'AppError',
    message = 'General application error',
    details,
    err,
  }: TConstructorParams = {}) {
    super(message)

    // Override prototype because Typescript doesn't handle Error inheritence correctly
    // ref: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.code = code
    this.message = message
    this.details = details

    if (err) {
      this.stack = err.stack
    }
  }

  toJSON(): TJsonPayload {
    const payload: TJsonPayload = {
      code: this.code,
      message: this.message,
    }

    if (this.details) {
      payload.details = this.details
    }

    return payload
  }
}
