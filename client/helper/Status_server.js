const highlight = 'color:green'

class Status {
  constructor(initMessage) {
    this.success = undefined
    this.unexpectedErr = false
    this.errorMessage = ''
    this.unexpectedErrorMessage = ''
    this.initMessage = initMessage || ''

    return this
  }
  pass(success, errorMessage) { // phase out
    if (this.success === undefined) {
      this.success = success;
      if (errorMessage !== undefined)
        this.errorMessage = errorMessage
    }
  }
  succeed() {
    if (this.success === undefined)
      this.success = true

    console.log(`%c(Status) Good request`, highlight)
  }
  complete() {
    if (this.success === undefined)
      this.success = true

    console.log(`%c(Status) Good request`, highlight)
  }
  error(message) {
    this.success = false
    if (message !== undefined)
      this.errorMessage = message
    throw new Error(message)
  }
  unexpectedError(message) {
    this.success = false
    this.unexpectedErr = true
    this.unexpectedErrorMessage = "Unexpected error - "
    if (message !== undefined)
      this.unexpectedErrorMessage += message
  }

  results() {
    return { success: this.success, errorMessage: this.errorMessage }
  }
  didSucceed() {
    return this.success
  }
  didFail() {
    if (this.success === false)
      return true
    else return false
  }
  getErrorMessage() {
    if (this.unexpectedErr)
      return this.unexpectedErrorMessage

    return this.errorMessage
  }
  printErrorMessage_server() {
    if (this.unexpectedErr)
      console.error(`(Status 1) ${this.unexpectedErrorMessage}`)

    console.error(`(Status${this.unexpectedErr ? " 2" : ''}) ${this.errorMessage}`)
  }

}

module.exports = { Status }

// export default Status