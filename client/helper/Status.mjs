const highlight = 'color:green'

class Status {
  constructor(initMessage) {
    this.success = undefined
    this.unexpectedErr = false
    this.errorMessage = ''
    this.errorArray = []
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

    console.log(`%c(Status) Passed with ${this.errorArray.length} errors`, highlight)
  }
  error(message) {
    this.success = false
    if (message !== undefined)
      this.errorMessage = message
    throw new Error(message)
  }
  softError(message) {
    if (message !== undefined)
      this.errorArray.push(message)
  }
  unexpectedError(message) {
    this.success = false
    this.unexpectedErr = true
    this.unexpectedErrorMessage = "Unexpected error"
    if (message !== undefined)
      this.unexpectedErrorMessage += ` - ${message}`
  }

  results() {
    return { success: this.success, errorMessage: this.errorMessage }
  }
  didSucceed() {
    if (this.errorArray.length > 0) {

    }
    return this.success
  }
  didFail() {
    if (this.success === false)
      return true
    else return false
  }
  isSoftError() {
    if (this.errorArray.length > 0) return true
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
  getStatusReport() {
    return {
      success: this.success,
      noErrors: !this.isSoftError() && !this.unexpectedErr ? true : false,
      errorMessage: this.errorMessage,
      softErrors: this.errorArray,
      unexpectedErrorMessage: this.unexpectedErrorMessage
    }
  }
  printReport() {
    console.log(" ")
    console.log(" - Error report - ")
    console.log(" ")
    if (this.success === undefined) console.error(`     (Incomplete) Did not pass request`)
    else if (!this.success) console.error(`     (Hard Error) ${this.errorMessage}`)

    if (this.unexpectedErr) console.error(`     (Unexpected Error) ${this.unexpectedErrorMessage}`)

    if (this.isSoftError())
      this.errorArray.forEach(err => {
        console.error(`     (Soft Error) ${err}`)
      });

  }

}

export default Status