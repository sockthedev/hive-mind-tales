// This file contains our custom errors

export class ValidationError extends Error {
  statusCode = 400

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InvalidArgumentError extends Error {
  statusCode = 400

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, InvalidArgumentError.prototype)
  }
}

export class InternalError extends Error {
  statusCode = 500

  constructor(message = "An unexpected error occured") {
    super(message)
    Object.setPrototypeOf(this, InternalError.prototype)
  }
}

export class NotImplementedError extends Error {
  statusCode = 500

  constructor(message = "This feature has not yet been implemented") {
    super(message)
    Object.setPrototypeOf(this, NotImplementedError.prototype)
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401

  constructor(message = "Unauthorized") {
    super(message)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
