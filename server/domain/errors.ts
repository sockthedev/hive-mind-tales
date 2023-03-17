// This file contains our custom errors

export class ValidationError extends Error {
  statusCode = 400

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InvalidArgumentError extends Error {
  statusCode = 400

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InternalError extends Error {
  statusCode = 500

  constructor(message = "An unexpected error occured") {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotImplementedError extends Error {
  statusCode = 500

  constructor(message = "This feature has not yet been implemented") {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ForbiddenError extends Error {
  statusCode = 403

  constructor(message = "Forbidden") {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401

  constructor(message = "Unauthorized") {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
