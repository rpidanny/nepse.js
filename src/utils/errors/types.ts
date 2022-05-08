export type TJsonPayload = {
  code: string
  message: string
  details?: Record<string, unknown>
}

export type TConstructorParams = {
  code?: string
  message?: string
  details?: Record<string, unknown>
  err?: Error
}
